window.onload = function(_loadEvt) {
    peerCode = getRandomNum();
    const peer = new Peer("coderGtm-Easy-Share-"+peerCode);
    peer.on('open', function(id) {
        alert(id)
        document.getElementById("peerCode").innerText = peerCode;
        document.getElementById("connectionWaiting").style.display = "flex";
        connected = false;
        peer.on("connection", function(conn) {
            if (connected) {
                //Connection aborted
                conn.close();
                return;
            }
            connection = conn;
            document.getElementById("connectionWaiting").style.display = "none";
            document.getElementById("connectionConnected").style.display = "block";
            connection.on("open", function() {
                alert("open");
            })
        });
        peer.on("error", function(err) {
            alert("An error occured. Please try again.");
        });
    });
}
function getRandomNum() {
    min = 10000;
    max = 99999;
    return Math.random() * (max - min) + min;
}