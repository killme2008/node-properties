##Purpose

node-properties is a node.js module to read properties config file.It will read properties and cast it to json.

##Tutorial

        var prop=require('node_properties');
        prop.read("./test.properties",function(err,config){
                if(err) throw err;
                console.log(config['option']);
        });

##API

        read(path,callback,[encoding]);
        callback function:
        function(err,data){...}


