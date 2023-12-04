import React, { useState, useEffect } from "react";

const CasperWalletProvider = window.CasperWalletProvider;
const CasperWalletEventTypes = window.CasperWalletEventTypes;

export const WalletConnector = ({ setWalletAccountHash }) => {
	const [isConnected, setConnected] = useState(false);
	const provider = CasperWalletProvider();

	useEffect(() => {
		setTimeout(async () => {
			try {
				const connected = await provider.isConnected();
				setConnected(connected);
			} catch (err) {
				console.log(err);
			}
		}, 100);
	}, []);

	useEffect(() => {
		const asyncFn = async () => {
			try {
				const accountHash = await provider.getActivePublicKey();
				setWalletAccountHash(accountHash);
			} catch (err) {
				console.log(err);
			}
		};

		if (isConnected) {
			asyncFn();
		}

		window.addEventListener(CasperWalletEventTypes.Locked, (_) => {
			setWalletAccountHash(null);
		});

		window.addEventListener(CasperWalletEventTypes.Unlocked, (event) => {
			const state = JSON.parse(event.detail);
			if (state.isConnected) {
				setWalletAccountHash(state.activeKey);
			}
		});

		window.addEventListener(CasperWalletEventTypes.ActiveKeyChanged, (event) => {
			const state = JSON.parse(event.detail);
			if (state.isConnected) {
				setWalletAccountHash(state.activeKey);
			}
		});
		
		window.addEventListener(CasperWalletEventTypes.Connected, (event) => {
			const state = JSON.parse(event.detail);
			setWalletAccountHash(state.activeKey);
		});

		window.addEventListener(CasperWalletEventTypes.Disconnected, (_) => {
			setWalletAccountHash(null);
		});
	}, [isConnected]);

	return null;
};

export const WalletScreen = ({ width }) => {
	const provider = CasperWalletProvider();

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