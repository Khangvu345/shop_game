import { useState } from 'react';

type Player = 'X' | 'O' | null;


export function Page404() {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[]>([]);

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    const checkWinner = (newBoard: Player[]) => {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                setWinner(newBoard[a]);
                setWinningLine(pattern);
                return newBoard[a];
            }
        }

        if (newBoard.every(cell => cell !== null)) {
            setWinner('Draw');
            return 'Draw';
        }

        return null;
    };

    const handleCellClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const gameResult = checkWinner(newBoard);
        if (!gameResult) {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setWinningLine([]);
    };

    const goHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="page-container">
            {/* Animated background pattern */}
            <div className="pattern-background" />

            {/* Floating bubbles */}
            <div className="bubbles">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="bubble" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${10 + Math.random() * 10}s`
                    }} />
                ))}
            </div>

            {/* Main content */}
            <div className="content-wrapper">
                {/* Console frame */}
                <div className="console-frame">
                    {/* Top bar */}
                    <div className="console-header">
                        <div className="header-left">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                                <path d="M6 11h.01M10 11h.01M6 15h8"/>
                            </svg>
                            <span>Lỗi 404</span>
                        </div>
                        <div className="header-right">
                            <div className="score-badge">
                                <span>Lượt hiện tại: Người chơi {currentPlayer}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="console-body">
                        {/* 404 Error */}
                        <div className="error-code-container">
                            <h1 className="error-code">404</h1>
                            <p className="error-subtitle">Tính năng chưa phát triển!!!</p>
                        </div>

                        {/* Error message */}
                        <div className="message-box">
                            <p className="message-text">Trang bạn tìm đang trong quá trình phát triển</p>
                            <p className="message-hint">🎮Chơi một ván XO để giải tỏa căng thẳng🕹️</p>
                        </div>

                        {/* Tic Tac Toe Game */}
                        <div className="game-container">
                            {winner && (
                                <div className="game-result-overlay">
                                    <div className="result-content">
                                        {winner === 'Draw' ? (
                                            <>
                                                <div className="result-icon draw">🤝</div>
                                                <p className="result-text">Hòa rồi</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="result-icon win">🎉</div>
                                                <p className="result-text">Người chơi {winner} chiến thắng!</p>
                                            </>
                                        )}
                                        <div className="result-buttons">
                                            <button className="result-btn play-again" onClick={resetGame}>
                                               Chơi lại
                                            </button>
                                            <button className="result-btn go-home" onClick={goHome}>
                                                Về trang chủ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="game-board">
                                {board.map((cell, index) => (
                                    <button
                                        key={index}
                                        className={`game-cell ${cell ? 'filled' : ''} ${winningLine.includes(index) ? 'winning' : ''}`}
                                        onClick={() => handleCellClick(index)}
                                        disabled={!!cell || !!winner}
                                    >
                                        {cell && (
                                            <span className={`player-mark ${cell === 'X' ? 'mark-x' : 'mark-o'}`}>
                        {cell}
                      </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="game-info">
                                {!winner && (
                                    <p className="turn-indicator">
                                        Lượt của người chơi <span className={currentPlayer === 'X' ? 'highlight-x' : 'highlight-o'}>{currentPlayer}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="button-group">
                            <button
                                className="game-button button-primary"
                                onClick={goHome}
                            >
                                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                <span>Về trang chủ</span>
                            </button>

                            <button
                                className="game-button button-secondary"
                                onClick={() => window.history.back()}
                            >
                                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="1 4 1 10 7 10"/>
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                                </svg>
                                <span>Quay lại trang trước đó</span>
                            </button>

                            <button
                                className="game-button button-reset"
                                onClick={resetGame}
                            >
                                <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10"/>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                                <span>Chơi lại</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom decoration */}
                    <div className="console-footer" />
                </div>

                {/* Floating decorative icons */}
                <div className="floating-icon floating-icon-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                </div>

                <div className="floating-icon floating-icon-right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                </div>
            </div>

            <style>{`
        * {
          box-sizing: border-box;
        }

        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #ffffff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow: hidden;
          position: relative;
        }

        .pattern-background {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.2) 0%, transparent 50%);
        }

        .bubbles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bubble {
          position: absolute;
          width: 12px;
          height: 12px;
          background: rgba(20, 184, 166, 0.3);
          border-radius: 50%;
          animation: floatUp linear infinite;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 56rem;
          width: 100%;
          animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .console-frame {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px rgba(20, 184, 166, 0.15);
          border: 3px solid rgba(20, 184, 166, 0.3);
          overflow: hidden;
        }

        .console-header {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .score-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
        }

        .console-body {
          padding: 3rem 2rem;
          text-align: center;
        }

        .error-code-container {
          margin-bottom: 1.5rem;
        }

        .error-code {
          font-size: 8rem;
          font-family: monospace;
          background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 0;
          line-height: 1;
          animation: gentle-pulse 3s ease-in-out infinite;
        }

        @keyframes gentle-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .error-subtitle {
          color: #0f766e;
          font-size: 1.5rem;
          margin: 1rem 0 0 0;
        }

        .message-box {
          background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
          border: 2px solid #99f6e4;
          border-radius: 1rem;
          padding: 1.5rem;
          margin: 2rem auto;
          max-width: 500px;
        }

        .message-text {
          color: #0f766e;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .message-hint {
          color: #0891b2;
          margin: 0;
          font-size: 0.95rem;
        }

        .game-container {
          background: white;
          border: 3px solid #14b8a6;
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem auto;
          max-width: 450px;
          position: relative;
          box-shadow: 0 4px 20px rgba(20, 184, 166, 0.1);
        }

        .game-result-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 0.75rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .result-content {
          text-align: center;
        }

        .result-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounceIn 0.5s ease-out;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .result-text {
          color: #0f766e;
          font-size: 2rem;
          margin: 0 0 2rem 0;
        }

        .result-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .result-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .play-again {
          background: #14b8a6;
          color: white;
        }

        .play-again:hover {
          background: #0d9488;
          transform: translateY(-2px);
        }

        .go-home {
          background: #06b6d4;
          color: white;
        }

        .go-home:hover {
          background: #0891b2;
          transform: translateY(-2px);
        }

        .game-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .game-cell {
          aspect-ratio: 1;
          background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%);
          border: 3px solid #99f6e4;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #0f766e;
          position: relative;
          overflow: hidden;
        }

        .game-cell:hover:not(.filled):not(:disabled) {
          background: linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 100%);
          border-color: #14b8a6;
          transform: scale(1.05);
        }

        .game-cell:disabled {
          cursor: not-allowed;
        }

        .game-cell.filled {
          background: linear-gradient(135deg, #e0f2fe 0%, #f0fdfa 100%);
        }

        .game-cell.winning {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #f59e0b;
          animation: celebrate 0.5s ease-out;
        }

        @keyframes celebrate {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .player-mark {
          animation: popIn 0.3s ease-out;
        }

        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .mark-x {
          color: #14b8a6;
        }

        .mark-o {
          color: #06b6d4;
        }

        .game-info {
          min-height: 2rem;
        }

        .turn-indicator {
          color: #0f766e;
          font-size: 1.1rem;
          margin: 0;
        }

        .highlight-x {
          color: #14b8a6;
        }

        .highlight-o {
          color: #06b6d4;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .game-button {
          padding: 0.875rem 1.75rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .game-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(20, 184, 166, 0.3);
        }

        .game-button:active {
          transform: translateY(0);
        }

        .button-primary {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          border-color: #5eead4;
        }

        .button-secondary {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          border-color: #67e8f9;
        }

        .button-reset {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-color: #fbbf24;
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .console-footer {
          height: 0.5rem;
          background: linear-gradient(90deg, #14b8a6 0%, #06b6d4 50%, #14b8a6 100%);
        }

        .floating-icon {
          position: absolute;
          color: rgba(20, 184, 166, 0.15);
          width: 5rem;
          height: 5rem;
          pointer-events: none;
        }

        .floating-icon svg {
          width: 100%;
          height: 100%;
        }

        .floating-icon-left {
          top: -2rem;
          left: -2rem;
          animation: float-gentle 4s ease-in-out infinite;
        }

        .floating-icon-right {
          bottom: -2rem;
          right: -2rem;
          animation: float-gentle 4s ease-in-out infinite 2s;
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }

        @media (max-width: 768px) {
          .console-body {
            padding: 2rem 1rem;
          }

          .error-code {
            font-size: 5rem;
          }

          .error-subtitle {
            font-size: 1.2rem;
          }

          .game-container {
            padding: 1.5rem;
          }

          .game-cell {
            font-size: 2rem;
          }

          .result-text {
            font-size: 1.5rem;
          }

          .floating-icon {
            width: 3rem;
            height: 3rem;
          }

          .button-group {
            flex-direction: column;
            width: 100%;
          }

          .game-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
}
