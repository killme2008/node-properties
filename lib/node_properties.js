var fs=require('fs');
var IoBuffer=require("./io_buffer.js").IoBuffer;
function LineReader(encoding){
    this.buf=new IoBuffer();
    this.skipLF=false;
    this.encoding=encoding;
}
LineReader.prototype.__append=function(data){
    this.buf.put(data);
}
LineReader.prototype.readLine=function(){
    this.buf.flip();
    var lineBegin=0;
    var lineEnd=0;
    var eof=false;
    var remaining=this.buf.remaining();
    while(lineEnd++<remaining){
        var ch=String.fromCharCode(this.buf.get(lineEnd));
        if(ch=='\r'){
            this.skipLF=true;
            eof=true;
            break;
        }
        if(ch=='\n'){
            if(this.skipLF){
                lineBegin++;
                this.skipLF=false;
                continue;
            }
            eof=true;
            break;
        }
        this.skipLF=false;
    }

    var rt=null;
    if(eof){
        rt=this.buf.buf.toString(this.encoding,lineBegin,lineEnd);
        this.buf.position=lineEnd+1;
    }
    this.buf.compact();
    return rt;
}
var commentPat=/^#.*/;
var blankLine=/^\s*$/;
exports.read=function(path,callback,encoding){
    var rs=fs.createReadStream(path,{bufferSize:8192});
    var reader=new LineReader(encoding||'utf8');
    var rt={};
    rs.on('error',function(error){
        callback(error,null);
    });
    rs.on('end',function(){
        rs.emit('data',new Buffer('\n'));
        callback(null,rt);
    });
    rs.on('data',function(buf){
        reader.__append(buf);
        var line=null;
        while((line=reader.readLine())!=null){
            line=line.trim();
            if(commentPat.test(line))
                continue;
            if(blankLine.test(line))
                continue;
            var sepIndex=line.indexOf("=");
            if(sepIndex>0){
                var key=line.substring(0,sepIndex).trim();
                var value=line.substring(sepIndex+1).trim();
                rt[key]=value;
            }else
                throw new Error("Invalid line:"+line);
        }
    });

}
