window.onload = function(_loadEvt) {
    peerCode = getRandomNum();
    const peer = new Peer("coderGtm-Easy-Share-"+peerCode);
    peer.on('open', function(id) {
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
            setTimeout(function() {
                document.getElementById("connectionInterface").classList.add("fade-out-top");
            },2000);
            connection.on("open", function() {
                
            })
        });
    });
    peer.on("error", function(err) {
        console.error(err);
        alert("An error occured. Please try again.");
    });
}
function getRandomNum() {
    min = 10000;
    max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}