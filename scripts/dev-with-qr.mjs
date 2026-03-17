import qrcodeTerminal from 'qrcode-terminal';
import { createServer } from 'vite';

const startDevServer = async () => {
	const server = await createServer({
		configFile: 'vite.config.ts',
		server: {
			host: '0.0.0.0',
		},
	});

	await server.listen();
	server.printUrls();

	const networkUrl = server.resolvedUrls?.network?.[0];

	if (networkUrl) {
		console.log('\nScan this QR code on your phone:\n');
		qrcodeTerminal.generate(networkUrl, { small: true });
	}
};

startDevServer().catch((error) => {
	console.error(error);
	process.exit(1);
});
