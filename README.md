node-properties is a node.js module to read properties config file.It will read properties and cast it to json.
Useage:

var prop=require('node_properties');
prop.read("./test.properties",function(json){
        console.log(json['option']);
});
