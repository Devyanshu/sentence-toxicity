// import * as toxicity from '@tensorflow-models/toxicity';

// console.log('in here');
const samples = [];
// const samples = [
//     {
//         'id': '002261b0415c4f9d',
//         'text':
//             'We\'re dudes on computers, moron.  You are quite astonishingly stupid.'
//     },
//     {
//         'id': '0027160ca62626bc',
//         'text':
//             'Please stop. If you continue to vandalize Wikipedia, as you did to Kmart, you will be blocked from editing.'
//     },
//     {
//         'id': '002fb627b19c4c0b',
//         'text':
//             'I respect your point of view, and when this discussion originated on 8th April I would have tended to agree with you.'
//     }
// ];

let model, labels;

const classify = async (inputs) => {
    const results = await model.classify(inputs);
    return inputs.map((d, i) => {
        const obj = { 'text': d };
        results.forEach((classification) => {
            obj[classification.label] = classification.results[i].match;
        });
        return obj;
    });
};

const addPredictions = (predictions) => {

    const tableWrapper = document.querySelector('#table-wrapper');

    predictions.forEach(d => {
        const predictionDom = `<div class="row">
      <div class="text">${d.text}</div>
      ${
            labels
                .map(
                    label => {
                        return `<div class="${
                            'label' +
                            (d[label] === true ? ' positive' :
                                ' not-p')}">${d[label]}</div>`
                    })
                .join('')}
    </div>`;
        tableWrapper.insertAdjacentHTML('beforeEnd', predictionDom);
    });
};

const predict = async () => {
    model = await toxicity.load();
    console.log("done");
    document.getElementById("loader").style.display = "none";

    labels = model.model.outputNodes.map(d => d.split('/')[0]);

    const tableWrapper = document.querySelector('#table-wrapper');
    tableWrapper.insertAdjacentHTML(
        'beforeend', `<div class="row">
    <div class="text">Sentence</div>
    ${labels.map(label => {
            return `<div class="label">${label.replace('_', ' ')}</div>`;
        }).join('')}
  </div>`);

    const predictions = await classify(samples.map(d => d.text));
    addPredictions(predictions);
    document.querySelector('#classify-new-text')
        .addEventListener('click', (e) => {
            const text = document.querySelector('#classify-new-text-input').value;
            const predictions = classify([text]).then(d => {
                addPredictions(d);


            });
        });
};

predict();
