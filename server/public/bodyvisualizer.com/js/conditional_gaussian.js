// ***************************************************************** LICENSE AND COPYRIGHT *****************************************************************
// 
// Copyright Max Planck Gesellshaft, 2011
// 
// All software, data, text, and design used in this web application is the sole property of the Max Plank Gesellshaft and/or Brown University. 
// This application is provided solely for research and personal use.  Commercial use and reverse engineering of this application is explicitly prohibited.
// No warranty or suitability for any purpose is implied. 
// 
// Commercial licensing requests should be directed to Michael Black <black@is.mpg.de> .
// 
// Patents pending.
//
// *********************************************************************************************************************************************************


// Some matrix functions
function dot_product(v_1, v_2) {
	var sum = 0;
	for (var i = v_1.length; i; ) {
		--i;
		sum += v_1[i]*v_2[i];
	}
	return sum;
}

// The matrix is assumed to be stored row wise
function matrix_times_vector(m_1, v_1) {
	var dp = dot_product;
	var product = new Array(v_1.length);
	for (i = m_1.length; i; ) {
		--i;
		product[i] = dp(m_1[i], v_1);
	}
	return product;
}

function matrix_transpose(matrix) {
	var transpose_matrix = [];
	if (matrix.length) {
		transpose_matrix = new Array(matrix[0].length);
		for (var i = 0; i < matrix[0].length; i++) {
			transpose_matrix[i] = new Array(matrix.length);
			for (var j = 0; j < matrix.length; j++) { transpose_matrix[i][j] = matrix[j][i]; }
		}
	}
	return transpose_matrix;
}

// This function requires the library sylvester.js
function matrix_invert(matrix) {
	if (! matrix.length) { return []; }
	if (matrix.length == 1) {
		return [[1/matrix[0][0]]];
	} else {
		return $M(matrix).inverse().elements;
	}	
}


// This class represents a collection of random variables that have a multivariate
// in which the values of certain variables have been fixed.
//
// To intialize the class, the mean and covariance matrix is supplied, along with a
// list of which variables are initially conditioned and unconditioned, and the values
// of the conditioned variables.
// 
// This class will compute the means of the unconditioned variables given the values
// of the conditioned variables. Furthermore, this class is designed to be used for
// highly dynamic operations. The means of the unconditioned variables are are efficiently
// updated as new variables are condioned or unconditioned. Furthermore, one variable can
// be set as "active". As its value changes, the means are updated very efficiently.

var ConditionalMultivariateGaussian = Class.create({
	mu: [],
	sigma_by_column: [],
	
	max_index: 0,
	number_of_variables: 0,
	all_indices: [],
	is_conditioned: [],
	is_active: [],
	max_number_of_conditioned_variables: 100,
	
	number_of_conditioned_variables: 0,
	conditioned_indices: [],
	conditioned_values_by_index: {},
	previous_conditioned_values_by_index: {},
	conditioned_value_offsets: [],
	active_index_to_condition_indices_index: {},
	
	number_of_unconditioned_variables: 0,
	unconditioned_indices: [],
	conditioned_means: [],
	all_values: [],
	
	mu_1: {},
	mu_2: {},
	sigma_21_and_22: {},
	sigma_22: [],
	sigma_22_inverse: [],
	sigma_22_inverse_transpose: [],
	sigma_22_inverse_times_offsets: [],
	previous_sigma_22_inverse_times_offsets: [],
	sigma_21_times_sigma_22_inverse: {},
	
	// note: full_mu is an array, full_sigma_by_row is an array that contains the rows of sigma as arrays. Sigma is assumed
	// to be symmetric. (un)conditioned_indices are arrays of integers that refer to the rows (or columns) in sigma
	// (and/or entries in mu). conditioned_values is an array of the values of the conditioned variables.
	initialize: function(mu, sigma_by_column, unconditioned_indices, conditioned_indices, conditioned_values) {
		this.mu = mu;
		this.max_index = mu.length;
		this.sigma_by_column = sigma_by_column;
		
		this.all_values = new Array(this.max_index);
		this.is_conditioned = new Array(this.max_index);
		this.is_active = new Array(this.max_index);
		
		this.all_indices = unconditioned_indices.concat(conditioned_indices).sort();
		this.number_of_variables = this.all_indices.length;
		this.number_of_unconditioned_variables = unconditioned_indices.length;
		this.number_of_conditioned_variables = conditioned_indices.length;
		
		this.sorted_mu = new Array(this.number_of_variables);
		var index;
		for (i = this.number_of_variables; i; ) {
			index = this.all_indices[--i];
			this.sorted_mu[i] = mu[index];
		}
		for (i = this.number_of_unconditioned_variables; i; ) {
			index = unconditioned_indices[--i];
			this.is_conditioned[index] = false;
			this.is_active[index] = false;
			this.mu_1[index] = mu[index];
		}
		for (i = this.number_of_conditioned_variables; i; ) {
			index = conditioned_indices[--i];
			this.is_conditioned[index] = true;
			this.is_active[index] = false;
			this.mu_2[index] = mu[index];
			this.sigma_21_and_22[index] = this.sigma_by_column[index];
			this.conditioned_values_by_index[index] = conditioned_values[i];
			this.previous_conditioned_values_by_index[index] = conditioned_values[i];
		}
		
		// Because these are pre-alocated, they are made as long as possible, hence there length
		// should not be used to get the number of conditioend or unconditioned variables.
		this.unconditioned_indices = new Array(this.number_of_variables);
		// This should be changed to be bounded by the number of possibly conditioned variables
		this.conditioned_indices = new Array(this.max_number_of_conditioned_variables);
		
		this.set_index_partition();
		this.set_sigma_22();
		this.set_conditioned_value_offsets()
		return this.set_all_values();
	},
	
	set_index_partition: function() {
		var index, value;
		var u = this.number_of_unconditioned_variables, c = this.number_of_conditioned_variables;
		for (var i = this.number_of_variables; i; ) {
			index = this.all_indices[--i];
			if (this.is_conditioned[index]) {
				this.conditioned_indices[--c] = index;
			} else {
				this.unconditioned_indices[--u] = index;
			}
			if (this.is_active[index]) {
				delete this.sigma_21_times_sigma_22_inverse[index];
				this.is_active[index] = false;
			}
		}
		this.active_index_to_condition_indices_index = {};
	},
	
	uncondition_on_indices: function(newly_unconditioned_indices) {
		var index, partition_changed = false;
		for (var i = newly_unconditioned_indices.length; i; ) {
			index = newly_unconditioned_indices[--i];
			if (this.is_conditioned[index]) {
				this.is_conditioned[index] = false;
				++this.number_of_unconditioned_variables;
				--this.number_of_conditioned_variables;
				this.mu_1[index] = this.mu[index];
				delete this.mu_2[index];
				delete this.sigma_21_and_22[index];
				delete this.conditioned_values_by_index[index];
				partition_changed = true;
			}
		}
		
		if (! partition_changed) { return this.all_values; }
		this.set_index_partition();
		this.set_sigma_22();
		this.set_conditioned_value_offsets()
		return this.set_all_values();
	},
	
	condition_on_indices: function(newly_conditioned_indices, newly_conditioned_values) {
		var index, partition_changed = false;
		for (var i = newly_conditioned_indices.length; i; ) {
			index = newly_conditioned_indices[--i];
			if (! this.is_conditioned[index]) {
				this.is_conditioned[index] = true;
				++this.number_of_conditioned_variables;
				--this.number_of_unconditioned_variables;
				this.mu_2[index] = this.mu[index];
				this.sigma_21_and_22[index] = this.sigma_by_column[index];
				delete this.mu_1[index];
				partition_changed = true;
			}
			this.conditioned_values_by_index[index] = newly_conditioned_values[i];
			this.previous_conditioned_values_by_index[index] = newly_conditioned_values[i];
		}
		
		if (partition_changed) {
			this.set_index_partition();
			this.set_sigma_22();
			this.set_conditioned_value_offsets()
			return this.set_all_values();
		} else {
			this.sigma_22_inverse_times_offsets = matrix_times_vector(this.sigma_22_inverse, this.conditioned_value_offsets);
			this.set_conditioned_value_offsets()
			return this.update_all_values();
		}

	},
	
	set_conditioned_value_offsets: function() {
		this.conditioned_value_offsets = new Array(this.number_of_conditioned_variables);
		var index, offset;
		for (i = this.number_of_conditioned_variables; i; ) {
			index = this.conditioned_indices[--i];
			this.conditioned_value_offsets[i] = this.conditioned_values_by_index[index] - this.mu_2[index];
		}
		return this.conditioned_value_offsets;
	},
	
	set_sigma_22: function() {
		var i, temp_column;
		this.sigma_22 = new Array(this.number_of_conditioned_variables);
		for (i = this.number_of_conditioned_variables; i; ) {
			temp_column = this.sigma_21_and_22[this.conditioned_indices[--i]];
			this.sigma_22[i] = new Array(this.number_of_conditioned_variables);
			for (j = this.number_of_conditioned_variables; j; ) { --j; this.sigma_22[i][j] = temp_column[this.conditioned_indices[j]]; }
		}
		this.sigma_22_inverse = matrix_invert(this.sigma_22);
		this.sigma_22_inverse_tranpose = matrix_transpose(this.sigma_22_inverse);
	},
	
	set_all_values: function() {
		var index_u, i;
		for (i = this.number_of_unconditioned_variables; i; ) {
			index_u = this.unconditioned_indices[--i];
			this.all_values[index_u] = this.mu[index_u]; 
		}

		if (this.number_of_conditioned_variables > 0) {
			this.sigma_22_inverse_times_offsets = matrix_times_vector(this.sigma_22_inverse, this.conditioned_value_offsets);
			var c, j, temp_column, index_c;
			for (i = this.number_of_conditioned_variables; i; ) {
				index_c = this.conditioned_indices[--i];
				temp_column = this.sigma_21_and_22[index_c];
				c = this.sigma_22_inverse_times_offsets[i];
				for (j = this.number_of_unconditioned_variables; j; ) {
					index_u = this.unconditioned_indices[--j];
					this.all_values[index_u] += c*temp_column[index_u];
				}
				this.all_values[index_c] = this.conditioned_values_by_index[index_c];
			}
		}
		return this.all_values;
	},

	update_all_values: function(threshold) {
		if (! threshold) { threshold = .00001; }
		if (this.number_of_conditioned_variables > 0) {
			this.previous_sigma_22_inverse_times_offsets = this.sigma_22_inverse_times_offsets;
			this.sigma_22_inverse_times_offsets = matrix_times_vector(this.sigma_22_inverse, this.conditioned_value_offsets);
			var c, i, j, temp_column, index_u, index_c;
			for (i = this.number_of_conditioned_variables; i; ) {
				index_c = this.conditioned_indices[--i];
				temp_column = this.sigma_21_and_22[index_c];
				c = this.sigma_22_inverse_times_offsets[i] - this.previous_sigma_22_inverse_times_offsets[i];
				if (Math.abs(c) > threshold) {
					for (j = this.number_of_unconditioned_variables; j; ) {
						index_u = this.unconditioned_indices[--j];
						this.all_values[index_u] += c*temp_column[index_u];
					}
				} else {
					this.sigma_22_inverse_times_offsets[i] = this.previous_sigma_22_inverse_times_offsets[i];
				}
				this.all_values[index_c] = this.conditioned_values_by_index[index_c];
			}
		}
		
		return this.all_values;
	},
	
	update_conditioned_values: function(previously_conditioned_indices, newly_conditioned_values, threshold) {
		var index;
		for (var i = previously_conditioned_indices.length; i; ) {
			index = previously_conditioned_indices[--i];
			if (! this.is_conditioned[index]) {
				return this.condition_on_indices(previously_conditioned_indices, newly_conditioned_values);
			} else {
				this.previous_conditioned_values_by_index[index] = this.conditioned_values_by_index[index];
				this.conditioned_values_by_index[index] = newly_conditioned_values[i];
			}
		}
		this.update_conditioned_value_offsets();
		return this.update_all_values(threshold);
	},
	
	update_conditioned_value_offsets: function() {
		var index, offset;
		for (i = this.number_of_conditioned_variables; i; ) {
			index = this.conditioned_indices[--i];
			this.conditioned_value_offsets[i] += (this.conditioned_values_by_index[index] - this.previous_conditioned_values_by_index[index])
		}
		return this.conditioned_value_offsets;
	},
	
	set_indices_as_active: function(active_indices, values) {
		var index, just_updated = false;
		for (var i = active_indices.length; i; ) {
			if (! this.is_conditioned[active_indices[--i]]) {
				this.condition_on_indices(active_indices, values);
				just_updated = true;
			}
		}
		for (var i = active_indices.length; i; ) {
			index = active_indices[--i];
			this.is_active[index] = true;
			this.previous_conditioned_values_by_index[index] = this.conditioned_values_by_index[index];
			this.conditioned_values_by_index[index] = values[i];
		}

		for (var i = this.number_of_conditioned_variables; i; ) {
			index = this.conditioned_indices[--i];
			if (this.is_active[index] && (this.active_index_to_condition_indices_index[index] == null)) {
				this.active_index_to_condition_indices_index[index] = i;
				this.sigma_21_times_sigma_22_inverse[index] = this.offset_vector_for_column(i);
			}
		}
		if (! just_updated) {
			this.update_conditioned_value_offsets();
			return this.update_all_values();
		} else {
			return this.all_values;
		}
	},
	
	offset_vector_for_column: function(column_index) {
		var sigma_22_column_for_index = this.sigma_22_inverse_tranpose[column_index];
		var vector = new Array(this.max_index);
		
		for (var j = this.number_of_unconditioned_variables; j; ) { vector[this.unconditioned_indices[--j]] = 0; }
		
		var index, temp_column;
		for (var i = this.number_of_conditioned_variables; i; ) {
			temp_column = this.sigma_21_and_22[this.conditioned_indices[--i]];
			c = sigma_22_column_for_index[i];
			for (j = this.number_of_unconditioned_variables; j; ) {
				index = this.unconditioned_indices[--j];
				vector[index] += c*temp_column[index];
			}
		}
		return vector;
	},
	
	update_active_values: function(active_indices, new_values, threshold) {
		for (var i = active_indices.length; i; ) {
			if (! this.is_active[active_indices[--i]]) {
				this.update_conditioned_values(active_indices, new_values, threshold);
			}
		}
		
		if (! threshold) { threshold = .00001; }
		var index_a, new_value, previous_value, i, j, c, temp_column, index_u;
		for (var i = active_indices.length; i; ) {
			index_a = active_indices[--i];
			previous_value = this.conditioned_values_by_index[index_a];			
			new_value = new_values[i];
			
			c = new_value - previous_value;
			if (Math.abs(c) > threshold) {
				this.previous_conditioned_values_by_index[index_a] = previous_value;
				this.conditioned_values_by_index[index_a] = new_value;
				this.conditioned_value_offsets[this.active_index_to_condition_indices_index[index_a]] += c;
				this.all_values[index_a] = new_value;
				temp_column = this.sigma_21_times_sigma_22_inverse[index_a];
				for (j = this.number_of_unconditioned_variables; j; ) {
					index_u = this.unconditioned_indices[--j];
					this.all_values[index_u] += c*temp_column[index_u];
				}
			}
		}
		var index_c;
		for (var i = this.number_of_conditioned_variables; i; ) {
			index_c = this.conditioned_indices[--i];
			this.all_values[index_c] = this.conditioned_values_by_index[index_c];
		}
		return this.all_values;

	},
	
	get_values: function(indices) {
		var values = new Array(indices.length);
		for (var i = indices.length; i; ) {
			--i;
			values[i] = this.all_values[indices[i]];
		}
		return values;
	}
});
