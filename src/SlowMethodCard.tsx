import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Carte "méthode lente" affichée pendant la phase hook de chaque astuce : convainc
 * en une seconde que la méthode manuelle est pénible, via un compteur qui s'emballe.
 */
export const SlowMethodCard: React.FC<{
	description: string;
	tediumTarget: number;
	tediumUnit: string;
}> = ({description, tediumTarget, tediumUnit}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const scale = interpolate(entrance, [0, 1], [0.85, 1]);

	// Le compteur s'emballe vite puis ralentit en s'approchant de la cible (ease-out).
	const countProgress = interpolate(frame, [4, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const eased = 1 - Math.pow(1 - countProgress, 3);
	const count = Math.round(eased * tediumTarget);

	// Petit tremblement nerveux façon "clics frénétiques" pour renforcer l'agacement.
	const jitter = Math.sin(frame * 3) * 1.4;

	return (
		<div
			style={{
				transform: `scale(${scale}) rotate(${jitter}deg)`,
				opacity: entrance,
				width: 880,
				borderRadius: 28,
				overflow: 'hidden',
				boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
				fontFamily: 'Arial, Helvetica, sans-serif',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '18px 26px',
					background: '#241414',
				}}
			>
				<div style={{width: 16, height: 16, borderRadius: 999, background: '#FF5F57'}} />
				<div style={{width: 16, height: 16, borderRadius: 999, background: '#FEBC2E'}} />
				<div style={{width: 16, height: 16, borderRadius: 999, background: '#5A5A5A'}} />
				<div
					style={{
						marginLeft: 16,
						color: '#F5D9D9',
						fontWeight: 700,
						fontSize: 22,
						opacity: 0.85,
					}}
				>
					Méthode manuelle
				</div>
			</div>

			<div
				style={{
					background: '#FBEFEF',
					padding: '46px 40px 50px',
					textAlign: 'center',
				}}
			>
				<div style={{fontSize: 64, marginBottom: 10}}>😩</div>
				<div
					style={{
						fontSize: 30,
						fontWeight: 800,
						color: '#7A2020',
						marginBottom: 26,
					}}
				>
					{description}
				</div>
				<div
					style={{
						display: 'inline-flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '18px 34px',
						borderRadius: 16,
						background: '#7A2020',
						boxShadow: 'inset 0 0 0 2px #C24949',
					}}
				>
					<div
						style={{
							fontSize: 58,
							fontWeight: 900,
							color: '#FFFFFF',
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{count.toLocaleString('fr-FR')}
					</div>
					<div
						style={{
							fontSize: 20,
							fontWeight: 700,
							color: '#F5C6C6',
							marginTop: 4,
						}}
					>
						{tediumUnit}...
					</div>
				</div>
			</div>
		</div>
	);
};
