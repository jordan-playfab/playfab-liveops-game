const request = require("request");
const sourceCookieBanner = "./source/cookie-banner";

module.exports = function(grunt) {
	grunt.registerTask("getCookieBanners", function () {
        const done = this.async();
        const startTime = process.hrtime();

        const lang = "en-us";

        // Documentation on the endpoint can be found here: https://www.redtigerwiki.com/wiki/Cookie_consent_API_spec
        const endpoint = `https://uhf.microsoft.com/${lang}/shell/api/mscc?domain=vanguardoutrider.com`;
    
        request(endpoint, (error, _, body) => {
            if (error) {
                grunt.log.error("Failed to load cookie banner data from endpoint " + endpoint);
                done(false);
                return;
            }

            grunt.file.write(`${sourceCookieBanner}/${lang}.cookiebanner.json`, body);

            const endTime = process.hrtime(startTime);
            
            grunt.log.writeln("Collected banners in: %ds %dms", endTime[0], endTime[1] / 1000000);

            done();
        });
    });

    grunt.initConfig({
        run: {
            production: {
                exec: "npm run production",
                cmd: "npm",
                args: [
                    "run",
                    "production"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-run");

    grunt.registerTask("default", [
        "getCookieBanners",
        "run:production"
    ]);
};
