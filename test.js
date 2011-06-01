var prop=require('./lib/node_properties');

prop.read('./test.properties',function(config){
    console.dir(config);
});