
const JSZip = require("jszip");
const fs = require('fs');


const generate_ionconfig = (node) => {
    let str = "";
    let log = "";
    str += "wmKey " + node.wmKey + '\n';
    str += "sdrName " + node.sdrName + '\n';
    str += "wmSize " + node.wmSize + '\n';
    str += "configFlags 1\n";
    str += "heapWords " + node.heapWords + '\n'

    return {str:str,log:log}
};

const generate_ionrc = (state,uuid) => {
    let str = "";
    let log = "";
    let node = state.nodes[uuid];

    str += '1 '+node.ipn+' config.ionconfig\n@ 0\n';

    let links = [];
    for(var link_uuid in state.links){
        let link = state.links[link_uuid];
        // if(link.node1_uuid != node.uuid && link.node2_uuid != node.uuid){
        //     continue;
        // }
        let node1 = state.nodes[link.node1_uuid]
        let node2 = state.nodes[link.node2_uuid]
        for(const key in link.contacts){
            const contact = link.contacts[key];
            console.log(contact)
            str += ' a contact +'+contact.fromTime+' +'+
                contact.untilTime + ' ' +
                node1.ipn + ' ' +
                node2.ipn + ' ' +
                contact.rate + ' ' +
                contact.confidence +
                '\n';
            str += ' a contact +'+contact.fromTime+' +'+
                contact.untilTime + ' ' +
                node2.ipn + ' ' +
                node1.ipn + ' ' +
                contact.rate + ' ' +
                contact.confidence +
                '\n';
        }
        for(const key in link.ranges){
            const range = link.ranges[key];
            console.log(range)
            str += ' a range +'+range.fromTime+' +'+
                range.untilTime + ' ' +
                node1.ipn + ' ' +
                node2.ipn + ' ' +
                range.owlt + '\n';
            str += ' a range +'+range.fromTime+' +'+
                range.untilTime + ' ' +
                node1.ipn + ' ' +
                node2.ipn + ' ' +
                range.owlt + '\n';
        }
    }

    str += 's\nm horizon +0\n';

    return {str:str,log:log}
}

const generate_bprc = (state, uuid) => {
    let str = "";
    let log = "";
    let node = state.nodes[uuid];

    str += "1\na scheme ipn 'ipnfw' 'ipnadminep'\n";

    for(const endpointStr in node.endpoints.split(',')){
        str += 'a endpoint ipn:'+node.ipn+'.'+endpointStr+ ' q\n'
    }

    let links = [];
    for(let key in state.links){
        let link = state.links[key];
        if(link.node1_uuid == node.uuid || link.node2_uuid == node.uuid){
            links.push(link);
        }
    }

    let protocols = new Set();
    for(let link of links){
        protocols.add(link.protocol);
    }

    for(let protocol of protocols){
        if(protocol == "TCP"){
            let settings = node.protocolSettings["TCP"];
            str += 'a protocol tcp ' +
                settings.payloadBytesPerFrame +' ' +
                settings.overheadBytesPerFrame + ' ' +
                settings.nominalDataRate + '\n';
        }
        else if(protocol == "UDP"){
            let settings = node.protocolSettings["UDP"];
            str += 'a protocol tcp ' +
                settings.payloadBytesPerFrame +' ' +
                settings.overheadBytesPerFrame + ' ' +
                settings.nominalDataRate + '\n';
        }
    };
    let processed_uuids = new Set();
    links.forEach(function(link){
        console.log(link.protocolSettings)
        if(processed_uuids.has(link.uuid)){
            console.log("Duplicate link");
            console.log(link);
            let node1 = state.nodes[link.node1_uuid];
            let node2 = state.nodes[link.node2_uuid];
            log += "Duplicate link from "+node1.name +" to "+ node2.name +"\n";
            return;
        }
        processed_uuids.add(link.uuid);

        if(link.protocol === "TCP"){
            induct_port = link.protocolSettings.TCP.port1;
            outduct_port = link.protocolSettings.TCP.port2;
            other_uuid = link.node1_uuid;
            if(node.uuid === other_uuid){
                other_uuid = link.node2_uuid;
                str += ""
            }

            let other = state.nodes[other_uuid];
            let other_machine_uuid = other.machine;
            let other_addr = state.machines[other_machine_uuid].address;

            let local_address = state.machines[node.machine].address

            if(node.uuid == link.node1_uuid){
                str += "a induct tcp "+local_address+":"+outduct_port+" tcpcli\n";
            }else{
                str += "a induct tcp "+local_address+":"+induct_port+" tcpcli\n";
                str += "a outduct tcp "+other_addr+":"+outduct_port+" ''\n";
            }
        }
    });

    str += "r 'ipnadmin config.ipnrc'\ns\n";

    return {str:str,log:log}
};

const generate_ipnrc = (state, uuid) => {
    let str = "";
    let log = "";
    let node = state.nodes[uuid];

    let links = [];
    for(const key in state.links){
        let link = state.links[key];
        if(link.node1_uuid == node.uuid || link.node2_uuid == node.uuid){
            links.push(link);
        }
    }

    str += "a plan " + node.ipn + " tcp/"+node.ipn+"\n";

    let processed_uuids = new Set();
    links.forEach(function(link){
        console.log(link.protocolSettings)
        if(processed_uuids.has(link.uuid)){
            console.log("Duplicate link");
            console.log(link);
            let node1 = state.nodes[link.node1_uuid];
            let node2 = state.nodes[link.node2_uuid];
            log += "Duplicate link from "+node1.name +" to "+ node2.name +"\n";
            return;
        }
        processed_uuids.add(link.uuid);

        if(link.protocol === "TCP"){
            induct_port = link.protocolSettings.TCP.port1;
            outduct_port = link.protocolSettings.TCP.port2;
            other_uuid = link.node1_uuid;
            if(node.uuid === other_uuid){
                other_uuid = link.node2_uuid;
                str += ""
            }

            let other = state.nodes[other_uuid];
            let other_machine_uuid = other.machine;
            let other_addr = state.machines[other_machine_uuid].address;

            if(node.uuid != link.node1_uuid){
                str += "a plan "+other.ipn+" tcp/"+other_addr+":"+outduct_port+"\n";
            }
        }
    });

    return {str:str,log:log}
};

const generate_ionstart = () => {
    let str = "";
    let log = "";

    str += "# shell script to get node running\n" +
        "#!/bin/bash\n" +
        "ionadmin\tconfig.ionrc\n" +
        "sleep 1\n" +
        "ionsecadmin\tconfig.ionsecrc\n" +
        "sleep 1\n" +
        "bpadmin\t\tconfig.bprc";

    return{str:str,log:log}
}

const generate_ionstop = () => {
    let str = "";
    let log = "";

    str += "# shell script to remove all of my IPC keys\n" +
        "#!/bin/bash\n" +
        "bpadmin\t\t.\n" +
        "sleep 1\n" +
        "ionadmin\t."

    return{str:str,log:log}
}

const generate_ionsecrc = () => {
    let str = "";
    let log = "";

    str += "1"
    return{str:str,log:log}
}

const generate_header = () => {
    let str = "";
    let date = new Date();

    str +=  "# > Generated by the ION Configuration Editor\n"+
        "# > " + date.toLocaleDateString() +"\n" +
        "# > https://github.com/j-huff/ion-gui\n" +
        "# > John Huff\n\n";
    return str;
}

exports.configFromJSON = function(state){
    console.log("config from JSON")
    let zip = new JSZip();
    let log = "";
    let header = generate_header();
    for(var uuid in state.nodes){
        let node = state.nodes[uuid];
        let {str, nodelog} = generate_ionconfig(node);
        zip.file(node.name+"/config.ionconfig",header+str);
        log += nodelog;

        let res = generate_ionrc(state,uuid);
        zip.file(node.name+"/config.ionrc",header+res.str);
        log += res.log;

        res = generate_bprc(state,uuid);
        zip.file(node.name+"/config.bprc",header+res.str);
        log += res.log;

        res = generate_ipnrc(state,uuid);
        zip.file(node.name+"/config.ipnrc",header+res.str);
        log += res.log;

        res = generate_ionsecrc();
        zip.file(node.name+"/config.ionsecrc",header+res.str);
        log += res.log;

        res = generate_ionstop();
        zip.file(node.name+"/ionstop",header+res.str,{
            unixPermissions: "755"
        });
        log += res.log;

        res = generate_ionstart();
        zip.file(node.name+"/ionstart",header+res.str,{
            unixPermissions: "755"
        });
        log += res.log;
    }

    zip.file("build.log", log);
    return zip;

    // zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
    //     .pipe(fs.createWriteStream('out.zip'))
    //     .on('finish',function(){
    //     console.log("out.zip written")
    // });

}

// configFromJSON({"nodes":{"d09619f8-002b-4c70-b2dd-cab2a7d8db27":{"protocolSettings":{"TCP":{"payloadBytesPerFrame":1400,"overheadBytesPerFrame":100,"nominalDataRate":-1},"UDP":{"payloadBytesPerFrame":1400,"overheadBytesPerFrame":100,"nominalDataRate":-1}},"name":"A","ipn":"2","x":312,"y":288,"wmKey":65280,"sdrName":"ion2","wmSize":5000000,"heapWords":5000000,"endpoints":"1,2,3","uuid":"d09619f8-002b-4c70-b2dd-cab2a7d8db27","links":{},"hover":false,"machine":"08720d3d-81f0-4028-aceb-28e3681c174b"},"b2f51315-53e2-45b2-b08b-2c65bf870a97":{"protocolSettings":{"TCP":{"payloadBytesPerFrame":1400,"overheadBytesPerFrame":100,"nominalDataRate":-1},"UDP":{"payloadBytesPerFrame":1400,"overheadBytesPerFrame":100,"nominalDataRate":-1}},"name":"B","ipn":"3","x":424,"y":486,"wmKey":65280,"sdrName":"ion3","wmSize":5000000,"heapWords":5000000,"endpoints":"1,2,3","uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97","links":{},"hover":false,"machine":"08720d3d-81f0-4028-aceb-28e3681c174b"}},"activeStroke":"","contextMenu":{"opened":false,"data":{"link":{"contacts":{},"ranges":{},"connections":{},"protocol":"TCP","protocolSettings":{"TCP":{"port1":["3556"],"port2":["3557"]},"UDP":{"port1":1,"port2":2}},"node1_uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97","node2_uuid":"d09619f8-002b-4c70-b2dd-cab2a7d8db27","uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97d09619f8-002b-4c70-b2dd-cab2a7d8db27"}},"type":"edge","x":414,"y":410},"createNodeMenu":{"opened":false},"nodeEditHelpMessages":{},"createNodeHelpMessages":{},"machineEditHelpMessages":{},"helpMessages":{},"editingLink":"b2f51315-53e2-45b2-b08b-2c65bf870a97d09619f8-002b-4c70-b2dd-cab2a7d8db27","nodeEditor":{"showUnusedProtocols":true,"editingProtocol":null,"node_uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97","nodeData":{"protocolSettings":{"TCP":{"payloadBytesPerFrame":1400,"overheadBytesPerFrame":100,"nominalDataRate":-1},"UDP":{"payloadBytesPerFrame":1400,"overheadBytesPerFrame":100,"nominalDataRate":-1}},"name":"B","ipn":"3","x":424,"y":486,"wmKey":65280,"sdrName":"ion3","wmSize":5000000,"heapWords":5000000,"endpoints":"1,2,3","uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97","links":{},"hover":false,"machine":"08720d3d-81f0-4028-aceb-28e3681c174b"}},"links":{"b2f51315-53e2-45b2-b08b-2c65bf870a97d09619f8-002b-4c70-b2dd-cab2a7d8db27":{"contacts":{},"ranges":{},"connections":{},"protocol":"TCP","protocolSettings":{"TCP":{"port1":["3556"],"port2":["3557"]},"UDP":{"port1":1,"port2":2}},"node1_uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97","node2_uuid":"d09619f8-002b-4c70-b2dd-cab2a7d8db27","uuid":"b2f51315-53e2-45b2-b08b-2c65bf870a97d09619f8-002b-4c70-b2dd-cab2a7d8db27"}},"contacts":{},"meta":{"author":"No Author","projectTitle":"Untitled Project","read_id":"z6HeHtQSZM"},"machines":{"08720d3d-81f0-4028-aceb-28e3681c174b":{"name":"Machine A","address":"localhost","uuid":"08720d3d-81f0-4028-aceb-28e3681c174b","ports":"1-64000"}},"redirect":false,"editingMachine":null,"contactEditor":{"contactData":null},"linkEditor":{"currentLink":null},"bottomToolbar":{"pose":"closed"},"pageRightActive":"Link","scrollEditBoxes":{},"_radiumStyleState":{"projectTitle":{":hover":false},"projectAuthor":{":hover":false}},"08720d3d-81f0-4028-aceb-28e3681c174b":{"name":"Machine A","address":"localhost","uuid":"08720d3d-81f0-4028-aceb-28e3681c174b","ports":"1-64000"}})