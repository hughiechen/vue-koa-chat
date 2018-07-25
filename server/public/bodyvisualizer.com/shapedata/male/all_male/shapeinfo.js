ordering = [
"waist_circumference_pref_mm",
"chest_circumference_mm",
"hip_circumference_maximum_mm",
"stature_mm",
"weight_cube_root_kg",
"inseam_right_mm",
"fitness_hours"
];
filenames = [
"waist_circumference_pref_plus_5mm",
"chest_circumference_plus_5mm",
"hip_circumference_maximum_plus_5mm",
"stature_plus_5mm",
"weight_cube_root_plus_5kg",
"inseam_right_plus_5mm",
"fitness_plus_5hours"
];
means = [ 8.944047e+02, 1.021941e+03, 1.029496e+03, 1.774263e+03, 4.350045e+00, 7.961530e+02, 4.559389e+00 ]; 
covariance = [
[ 1.016833e+04, 8.356868e+03, 6.343672e+03, 2.546524e+03, 2.247066e+01, 2.354140e+02, -4.467876e+01 ],
[ 8.356868e+03, 8.928956e+03, 5.700942e+03, 1.790792e+03, 2.122468e+01, 8.776439e+01, -1.711339e+01 ],
[ 6.343672e+03, 5.700942e+03, 5.324874e+03, 2.119134e+03, 1.677411e+01, 5.787826e+02, -2.230402e+01 ],
[ 2.546524e+03, 1.790792e+03, 2.119134e+03, 5.460447e+03, 8.908750e+00, 3.041366e+03, -7.780974e+00 ],
[ 2.247066e+01, 2.122468e+01, 1.677411e+01, 8.908750e+00, 6.113030e-02, 2.705408e+00, -7.131429e-02 ],
[ 2.354140e+02, 8.776439e+01, 5.787826e+02, 3.041366e+03, 2.705408e+00, 2.401288e+03, 2.883056e+00 ],
[ -4.467876e+01, -1.711339e+01, -2.230402e+01, -7.780974e+00, -7.131429e-02, 2.883056e+00, 1.111947e+01 ]
]; 

if (model_loader != undefined ) { model_loader.finish_loading_shapeinfo(filenames, means, covariance); }

