var prop=require('./lib/node_properties');

prop.read('./test.properties',function(error,config){
    if(error) throw error;
    console.dir(config);
});