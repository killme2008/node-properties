var poolSize=1024;
function IoBuffer(){
    this.buf=new Buffer(poolSize);
    this.position=0;
    this.limit=this.buf.length;
}
function increaseBuf(buf,pos,limit,size){
    size=size||poolSize;
    var increaseSize=size>poolSize?size:poolSize;
    var newBuf=new Buffer(buf.length+increaseSize);
    buf.copy(newBuf,0,pos,limit);
    return newBuf;
}
IoBuffer.prototype.remaining=function(){
    return this.limit-this.position;
}
IoBuffer.prototype.hasRemaining=function(){
    return this.remaining()>0;
}
IoBuffer.prototype.flip=function(){
    this.limit=this.position;
    this.position=0;
}
IoBuffer.prototype.compact=function(){
    if(this.position==0){
        this.position=this.remaining();
        this.limit=this.buf.length;
        return;
    }
    this.buf.copy(this.buf,0,this.position,this.limit);
    this.position=this.remaining();
    this.limit=this.buf.length;
}
IoBuffer.prototype.get=function(idx){
    if(idx&&(idx<0||idx>this.limit))
        throw new Error("IndexOutOfBounds");
    if(idx)
        return this.buf[idx];
    else
        return this.buf[this.position++];
}
IoBuffer.prototype.put=function(data){
    if(this.remaining()<data.length){
        this.flip();
        this.buf=increaseBuf(this.buf,this.position,this.limit,data.length);
        this.position=this.remaining();
        this.limit=this.buf.length;
    }
    data.copy(this.buf,this.position);
    this.position+=data.length;
}
module.exports.IoBuffer=IoBuffer



