window.onload = function(_loadEvt) {
    peerCode = getRandomNum();
    const peer = new Peer("coderGtm-Easy-Share-"+peerCode);
    connection = null;
    newfiles = null;
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
            totalSize = 0;
            
            document.getElementById("connectionWaiting").style.display = "none";
            document.getElementById("connectionConnected").style.display = "block";
            setTimeout(function() {
                document.getElementById("connectionInterface").classList.add("fade-out-top");
                document.getElementById("fileInterface").style.display = "block";
            },2000);
            connection.on("open", function() {
                
                document.getElementById("file_upload").onchange = function(event) {
                    newfiles = event.target.files;
                    console.log(newfiles);
                    for (i=0;i<newfiles.length;i++) {
                        addToList(newfiles[i]);
                    }
                    document.getElementById("sendBtn").style.display = "block";
                }
            });
            connection.on("data", function(data) {
                percentage = data.split(":")[1];
                document.getElementById("progressBar").style.width = percentage+"%";
                document.getElementById("progressBar").innerHTML = percentage+"%";
                if (percentage == "100") {
                    var myModal = new bootstrap.Modal(document.getElementById('completionModal'), {});
                    myModal.show();
                    peer.destroy();
                }
            });
            connection.on("error",function(err) {
                console.error(err);
                alert("An error occured. Please try again.");
                location.reload();
            });
        });
    });
    peer.on("error", function(err) {
        console.error(err);
        alert("An error occured. Please try again.");
        location.reload();
    });
}
function addToList(file) {
    totalSize += file.size;
    li = document.createElement("li");
    li.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
    li.innerText = file.name;
    span = document.createElement("span");
    span.classList.add("badge","bg-primary","rounded-pill");
    span.innerText = getFormattedSize(file.size);
    li.appendChild(span);
    document.getElementById("fileList").appendChild(li);
    connection.send({f_info:{name:file.name,size:file.size}});
}
function prepareForLaunch() {
    document.getElementById("sendBtn").style.display = "none";
    document.getElementById("uploadBtn").style.display = "none";
    document.getElementById("zipTip").style.display = "none";
    document.getElementById("file_upload").style.display = "none";
    document.getElementById("progressBar").style.display = "block";
    for (i=0;i<newfiles.length;i++) {
        const blob = new Blob([newfiles[i]], { type: newfiles[i].type });
        send(newfiles[i].name,blob);
    }

}
function send(fname,blob) {
    console.log(blob);
    connection.send({
        file: blob,
        filename: fname,
        filetype: blob.type
    });
}
function getFormattedSize(bytes) {
    kb = Math.round(bytes/1024);
    if (kb<1024) {
        return kb+" KB";
    }
    else {
        mb = Math.round(kb/1024);
        if (mb<1024) {
            return mb+" MB";
        }
        else {
            gb = Math.round(mb/1024);
            return gb+" GB";
        }
    }
}
function getRandomNum() {
    min = 10000;
    max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
