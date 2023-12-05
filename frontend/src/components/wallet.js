import React, { useState, useEffect } from "react";

export const CasperWallet = {
	get _provider() {
		return window.CasperWalletProvider ? window.CasperWalletProvider() : null;
	},
	get _events() {
		return window.CasperWalletEventTypes ? window.CasperWalletEventTypes : null;
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

export const WalletConnector = ({ setWalletAccountHash }) => {
	const [isConnected, setConnected] = useState(false);
	const provider = CasperWallet;

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

export const WalletScreen = ({ width }) => {
	const provider = CasperWallet;

	return (
		<>
			<div className="popup">
				<div className="popup__content popup__content--g20">
					<>
						<button
							className="btn btn--redeem btn--w"
							onClick={provider.requestConnection}
						>
							Connect
						</button>
					</>
				</div>
			</div>
		</>
	);
}