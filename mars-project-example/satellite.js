const express = require('express');
const process = require('child_process');

const app = express();

// Easter Egg- The year Spirit / Opportunity rovers landed on mars
const port = 2004;

function defaultRoute(req, res) {
    res.send(req.path);
}
function plan(req, res) {
    let tfPlan = process.exec('terraform plan');
    tfPlan.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    tfPlan.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    tfPlan.on('close', (code) => {
        console.log(`Terraform plan process exited with code ${code}`);
    });
    res.send('OK PLAN');
}

function apply(req, res) {
    let tfPlan = process.exec('terraform apply -auto-approve');
    tfPlan.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    tfPlan.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    tfPlan.on('close', (code) => {
        console.log(`Terraform apply process exited with code ${code}`);
    });
    res.send('OK APPLY');
}

function destroy(req, res) {
    let tfPlan = process.exec('terraform destroy -auto-approve');
    tfPlan.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    tfPlan.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    tfPlan.on('close', (code) => {
        console.log(`Terraform apply process exited with code ${code}`);
    });
    res.send('OK DESTROY');
}
app.use('/plan', plan);
app.use('/apply', apply);
app.use('/destroy', destroy);

app.use(defaultRoute);
app.listen(port, () => console.log(`Satellite listening at http://localhost:${port}`))