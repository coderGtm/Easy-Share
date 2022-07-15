window.onload = function(loadEvt) {
    peerCode = getRandomNum();
    const peer = new Peer("coderGtm-Easy-Share-"+peerCode);
    peer.on('open', function(id) {
        
    });
}
function getRandomNum() {
    min = 10000;
    max = 99999;
    return Math.random() * (max - min) + min;
}