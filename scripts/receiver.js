window.onload = function(_loadEvt) {
    const peer = new Peer();
    peer.on('open', function(id) {
        document.getElementById("connectBtn").onclick = function() {
            peerCode = document.getElementById("peerCode").value;
            const connection = peer.connect("coderGtm-Easy-Share-"+peerCode,{reliable:true});
            connection.on("open", function() {
                totalSize = 0;
                receivedSize = 0;
                document.getElementById("connectionInterface").style.display = "none";
                document.getElementById("fileInterface").style.display = "block";
                connection.on("data",function(data) {
                    console.log(data);
                    if (data == "reset") {
                        document.getElementById("fileList").innerHTML = "";
                        totalSize = 0;
                    }
                    else if (data["f_info"]) {
                        document.getElementById("incomingFiles").style.display = "block";
                        addToList(data.f_info.name,data.f_info.size);
                    }
                    else {
                        document.getElementById("connected").style.display = "none";
                        document.getElementById("receiving").style.display = "block";
                        document.getElementById("progressBar").style.display = "block";

                        var blob = new Blob([data.file], {type: data.filetype});
                        receivedSize += blob.size;
                        percentage = Math.floor((receivedSize/totalSize)*100);
                        document.getElementById("progressBar").style.width = percentage+"%";
                        document.getElementById("progressBar").innerHTML = percentage+"%";
                        
                        connection.send("rp:"+ percentage);

                        downloadBlob(blob,data.filename);

                        if (percentage == 100) {
                            document.getElementById("receiving").innerHTML = "<strong>All files received.</strong>";
                            var myModal = new bootstrap.Modal(document.getElementById('completionModal'), {});
                            myModal.show();
                            setTimeout(function(){peer.destroy();},5000);
                        }
                    }
                });
            });
            connection.on("error",function(err) {
                console.error(err);
                alert("An error occured. Please try again.");
                location.reload();
            });
        }
    });
    peer.on("error", function(err) {
        console.error(err);
        alert("An error occured. Please try again.");
        location.reload();
    });
}

function addToList(fname,fsize) {
    totalSize += fsize;
    li = document.createElement("li");
    li.classList.add("list-group-item","d-flex","justify-content-between","align-items-center");
    li.innerText = fname;
    span = document.createElement("span");
    span.classList.add("badge","bg-primary","rounded-pill");
    span.innerText = getFormattedSize(fsize);
    li.appendChild(span);
    document.getElementById("fileList").appendChild(li);
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


function downloadBlob(blob, name = 'unknown') {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);
  
    // Create a link element
    const link = document.createElement("a");
  
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;
  
    // Append link to the body
    document.body.appendChild(link);
  
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );
  
    // Remove link from body
    document.body.removeChild(link);
}