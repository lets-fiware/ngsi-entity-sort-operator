/*
 * NGSI entity sort operator
 * https://github.com/lets-fiware/ngsi-entity-sort-operator
 *
 * Copyright (c) 2020 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (data != null && !Array.isArray(data)) {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var pushEvent = function pushEvent(data) {
        if (MashupPlatform.operator.outputs.entityOutput.connected) {
            MashupPlatform.wiring.pushEvent("entityOutput", data);
        }
    }

    var sortEntites = function sortEntites(indata) {
        indata = parseInputEndpointData(indata);

        var send_nulls = MashupPlatform.prefs.get("send_nulls");
        if (indata == null && send_nulls) {
            return pushEvent(null);
        } else if (indata == null) {
            return; // do nothing
        }

        var attr = MashupPlatform.prefs.get('prop_name');

        indata.sort((a, b) => {
            if (a[attr] < b[attr]) {
                return -1;
            }
            if (a[attr] > b[attr]) {
                return 1;
            }
            return 0;
        });

        pushEvent(indata);
    };

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("entityInput", sortEntites);
    }

    /* test-code */
    window.sortEntites = sortEntites;
    /* end-test-code */

})();
