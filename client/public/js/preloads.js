(function() {
    try {
        if (!["localhost", "", "woomy-arras.netlify.app", "woomy-arras.xyz", "www.woomy-arras.xyz", "development.woomy-arras.xyz"].includes(location.hostname)) {
            //    location.href = "https://woomy-arras.xyz/";
        }

        function loadFromStorage() {
            return (localStorage.getItem("popups") || "").split(",");
        }

        window.markAsRead = function markAsRead(item) {
            localStorage.setItem("popups", [...loadFromStorage(), item].join(","));
        }

        window.closePopup = function closePopup(item) {
            document.getElementById("mainWrapper").removeChild(document.getElementById(item));
        }

        function postAlert(alert) {
            if (loadFromStorage().includes(alert.name)) {
                return;
            }
            console.log(alert);
            const popup = document.createElement("div");
            popup.classList.add("popup");
            popup.id = alert.name;
            popup.innerHTML += `<span>${alert.title}</span><br/>${alert.text}<br/><button onclick="closePopup('${alert.name}');">Close</button><button onclick="markAsRead('${alert.name}');closePopup('${alert.name}');">Mark As Read</button><br/><span class="small">${new Date(alert.timeStamp)}</span>`;
            document.getElementById("mainWrapper").appendChild(popup);
        }
        fetch("//pine-mint-smartphone.glitch.me/announcements.json").then(r => r.json()).then(json => json.announcements.forEach(postAlert));
    } catch (e) {
        console.log("Error with preloads!");
    }
})();

window.servers = (() => {
    const myTZ = (new Date).getTimezoneOffset() / -60,
        TZGraph = {
            "Localhost": myTZ,
            "US East": -4,
            "US West": -7,
            "Amsterdam": 1,
            "Frankfurt": 2,
            "Singapore": 8
        };
    var serverIDs = 0;
    var servers = [...(window.herokuServers ? [...window.herokuServers] : []).map(r => {
        r.secure = r.secure == null ? true : r.secure;
        r.port = -1;
        r.name = r.id;
        r.id = serverIDs++;
        return r;
    }), {
        name: "z",
        id: 100,
        ip: "localhost",
        port: 3001,
        location: "Localhost-Localhost :DEV:",
        prefix: "",
        secure: false,
        region: "Localhost",
        loadData: true,
    }].sort((a, b) => b.players - a.players).sort((a, b) => Math.abs(TZGraph[a.region] - myTZ) - Math.abs(TZGraph[b.region] - myTZ));
    servers.forEach(server => {
        if (server.loadData) {
            let url = `${server.secure ? "https" : "http"}://${server.ip}${server.port === -1 ? "" : `:${server.port}`}/pingData.json`
            fetch(url).then(response => response.json().then(json => {
                console.log(json);
                let p = document.createElement("p");
                p.id = "server_" + server.name;
                p.textContent = `${server.region} | ${json.mode} | ${json.players}/${json.connectionLimit}`;
                document.getElementById("serverSelector").appendChild(p);
            }).catch(error => {
                console.error(error);
                servers = servers.filter(other => other.name !== server.name);
            }));
        } else {
            let p = document.createElement("p");
            p.id = "server_" + server.name;
            p.textContent = `${server.region} | ${server.mode} | ${server.players}/${server.connectionLimit}`;
            document.getElementById("serverSelector").appendChild(p);
        }
    })
    return servers//servers = servers.filter(server => server instanceof Array);

})()

function getFullURL(data, ws) {
    if (ws) {
        return `ws${data.secure ? "s" : ""}://${data.ip}${data.port === -1 ? "/" : `:${data.port}/`}`;
    } else {
        return `http${data.secure ? "s" : ""}://${data.ip}${data.port === -1 ? "/" : `:${data.port}/`}`;
    }
}