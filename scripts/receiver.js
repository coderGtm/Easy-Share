window.onload = function(_loadEvt) {
    const peer = new Peer();
    peer.on('open', function(id) {
        document.getElementById("connectBtn").onclick = function() {
            peerCode = document.getElementById("peerCode").value;
            const connection = peer.connect("coderGtm-Easy-Share-"+peerCode,{reliable:true});
            connection.on("open", function() {
                connection.on("data",function(data) {
                    console.log(data);
                    var blob = new Blob([data.file], {type: data.filetype});
                    downloadBlob(blob,data.filename);
                });
            })
        }
    });
}


function downloadBlob(blob, name = 'file.txt') {
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