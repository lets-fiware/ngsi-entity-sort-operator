/* globals MockMP */

(function () {

    "use strict";

    describe("NgsiEntitySort", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "prop_name": "name",
                    "send_nulls": true,
                },
                inputs: ['entityInput'],
                outputs: ['entityOutput']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.entityOutput.connect({simulate: () => {}});
        });

        it("sort test 1", function () {
            sortEntites([{name: 'xyz'}, {name: '123'}, {name: 'abc'}]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('entityOutput', [{name: '123'}, {name: 'abc'}, {name: 'xyz'}]);
        });


        it("allowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", true);

            sortEntites(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('entityOutput', null);
        });

        it("disallowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", false);

            sortEntites(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                sortEntites("{");
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                sortEntites(123);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });
    });
})();
