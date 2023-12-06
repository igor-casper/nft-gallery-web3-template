import { useState, useEffect } from "react";

const CasperWallet = {
	get _provider() {
		return window.CasperWalletProvider?.();
	},
	get _events() {
		return window.CasperWalletEventTypes ?? null;
	},
	events: {
		get locked() {
			return CasperWallet._events?.Locked;
		},
		get unlocked() {
			return CasperWallet._events?.Unlocked;
		},
		get activeKeyChanged() {
			return CasperWallet._events?.ActiveKeyChanged;
		},
		get connected() {
			return CasperWallet._events?.Connected;
		},
		get disconnected() {
			return CasperWallet._events?.Disconnected;
		}
	},
	requestConnection: function() {
		if (!CasperWallet._provider)
			return false;
		return CasperWallet._provider.requestConnection();
	},
	isConnected: function() {
		if (!CasperWallet._provider)
			return false;
		return CasperWallet._provider.isConnected();
	},
	getActivePublicKey: function() {
		if (!CasperWallet._provider)
			return null;
		return CasperWallet._provider.getActivePublicKey();
	}
}

const CasperDash = {
	get _provider() {
		return window.casperDashHelper ?? null;
	},
	get _events() {
		return {
			connected: "casperdash:connected",
			disconnected: "casperdash:disconnected",
			activeKeyChanged: "casperdash:activeKeyChanged",
			unsupported: "casperdash:unsupportedEventType"
		};
	},
	events: {
		get locked() {
			return CasperDash._events.unsupported;
		},
		get unlocked() {
			return CasperDash._events.unsupported;
		},
		get activeKeyChanged() {
			return CasperDash._events.activeKeyChanged;
		},
		get connected() {
			return CasperDash._events.connected;
		},
		get disconnected() {
			return CasperDash._events.disconnected;
		}
	},
	requestConnection: function () {
		if (!CasperDash._provider)
			return false;
		return CasperDash._provider.requestConnection();
	},
	isConnected: function () {
		if (!CasperDash._provider)
			return false;
		return CasperDash._provider.isConnected();
	},
	getActivePublicKey: function () {
		if (!CasperDash._provider)
			return null;
		return CasperDash._provider.getActivePublicKey();
	}
}

export const AutoWalletProvider = {
	get _provider() {
		if (window.CasperWalletProvider)
			return CasperWallet;
		return CasperDash;
	},
	get _events() {
		return AutoWalletProvider._provider._events;
	},
	events: {
		get locked() {
			return AutoWalletProvider._provider.events.locked;
		},
		get unlocked() {
			return AutoWalletProvider._provider.events.unlocked;
		},
		get activeKeyChanged() {
			return AutoWalletProvider._provider.events.activeKeyChanged;
		},
		get connected() {
			return AutoWalletProvider._provider.events.connected;
		},
		get disconnected() {
			return AutoWalletProvider._provider.events.disconnected;
		}
	},
	requestConnection: function () {
		return AutoWalletProvider._provider.requestConnection();
	},
	isConnected: function () {
		return AutoWalletProvider._provider.isConnected();
	},
	getActivePublicKey: function () {
		return AutoWalletProvider._provider.getActivePublicKey();
	}
}

export const WalletConnector = ({ setWalletAccountHash }) => {
	const [isConnected, setConnected] = useState(false);
	const provider = AutoWalletProvider;

	useEffect(() => {
		setTimeout(async () => {
			const connected = await provider.isConnected();
			setConnected(connected);
		}, 100);
	}, []);

	useEffect(() => {
		const asyncFn = async () => {
			const accountHash = await provider.getActivePublicKey();
			setWalletAccountHash(accountHash);
		};

		if (isConnected) {
			asyncFn();
		}

		window.addEventListener(provider.events.locked, (_) => {
			setWalletAccountHash(null);
		});

		window.addEventListener(provider.events.unlocked, (event) => {
			const state = JSON.parse(event.detail);
			if (state.isConnected) {
				setWalletAccountHash(state.activeKey);
			}
		});

		window.addEventListener(provider.events.activeKeyChanged, (event) => {
			const state = JSON.parse(event.detail);
			if (state.isConnected) {
				setWalletAccountHash(state.activeKey);
			}
		});
		
		window.addEventListener(provider.events.connected, (event) => {
			const state = JSON.parse(event.detail);
			setWalletAccountHash(state.activeKey);
		});

		window.addEventListener(provider.events.disconnected, (_) => {
			setWalletAccountHash(null);
		});
	}, [isConnected]);

	return null;
};