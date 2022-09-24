const vscode = require('vscode');
const axios = require('axios').default

const request = axios.create({
	baseURL:"https://www.npmjs.com",
	timeout: 5000
})

function activate(context) {
	let disposable = vscode.commands.registerCommand('npm-quick-search.searchNpmPackage', async function () {
		try {
			const pack = await vscode.window.showInputBox({ placeHolder: "please enter keyword about package" })
			if (!pack) return
			const { data: packageList } = await request.get(`/search/suggestions?q=${pack}`)
			const searchRes = packageList.map(item => (
				{
					label: item.name,
					description: item.description
				}
			))
			const packageName = await vscode.window.showQuickPick(searchRes)
			if (!packageName) return
			// @ts-ignore
			const { data: packageInfoHtml } = await request.get(`/package/${packageName.label}`)
			const webView = vscode.window.createWebviewPanel("npm-quick-search", "npm-quick-search", { viewColumn: 1 })
			webView.webview.html = `${packageInfoHtml}`
		} catch (error) {
			vscode.window.showInformationMessage("some error happend, please try again~")
		}
	});
	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
