const conllu = require("conllu-stream");
const fs = require("fs");

var input = process.argv[2];
var output = process.argv[3];

if (!output) {
    output = input.substr(0, input.lastIndexOf("."));
    output = `${output}.json`;
}

main({ input, output });

function toJson(filename, cb) {
    console.log(`Converting ${filename} to json..`);

    const sentences = [];
    fs.createReadStream(input)
        .pipe(conllu())
        .on("data", (sentence) => {
            sentences.push(sentence);
        })
        .on("error", (err) => {
            return cb(err);
        })
        .on("end", () => {
            console.log(`Sentences: ${sentences.length}`);
            return cb(null, sentences);
        });
}

function main(params) {
    const { input, output } = params;

    console.log(`input: ${input}; output: ${output}`);

    toJson(input, (error, sentences) => {
        if (error) throw error;

        console.log(`writing json to ${output}..`);
        fs.writeFileSync(output, JSON.stringify(sentences), "utf8");
        console.log("done!");
        return;
    });
}
