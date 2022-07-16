window.onload = function(_loadEvt) {
    peerCode = getRandomNum();
    const peer = new Peer("coderGtm-Easy-Share-"+peerCode);
    connection = null;
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
                document.getElementById("fileInterface").style.display = "block";
            },2000);
            connection.on("open", function() {
                files = [];
                document.getElementById("file_upload").onchange = function(event) {
                    const newfiles = event.target.files;
                    console.log(files);
                    for (i=0;i<newfiles.length;i++) {
                        addToList(newfiles[i])
                    }
                    document.getElementById("sendBtn").style.display = "block";
                }
            })
        });
    });
    peer.on("error", function(err) {
        console.error(err);
        alert("An error occured. Please try again.");
    });
}
function addToList(file) {
    files.push(file);
    li = document.createElement("li");
    li.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
    li.innerText = file.name;
    span = document.createElement("span");
    span.classList.add("badge","bg-primary","rounded-pill");
    span.innerText = Math.round(file.size/1024/1024)+" mb";
    li.appendChild(span);
    document.getElementById("fileList").appendChild(li);
}
function prepareForLaunch() {
    //zip files here and then send from another function
}
function getRandomNum() {
    min = 10000;
    max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}