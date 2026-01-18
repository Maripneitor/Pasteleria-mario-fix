import React from 'react';
import styled from 'styled-components';

const ActionCard = () => {
    return (
        <StyledWrapper>
            <div className="card">
                <div className="header">
                    <span className="title">Configuración</span>
                </div>
                <ul className="list">
                    <li className="item">
                        <span className="label">Editar Perfil</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx={12} cy={12} r={3} />
                        </svg>
                    </li>
                    <li className="item">
                        <span className="label">Historial</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-spline">
                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                            <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
                        </svg>
                    </li>
                </ul>
                <div className="separator" />
                <ul className="list">
                    <li className="item delete">
                        <span className="label">Cerrar Sesión</span>
                        <span className="label action">Mantén para confirmar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                    </li>
                </ul>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card {
    background: #222222;
    width: 260px;
    border: 2px solid #313131;
    border-radius: 10px;
    padding: 3px 4px;

    .header {
        padding: 6px 8px;
        color: #e9e9e9;
        font-weight: bold;
    }

    .separator {
      width: 100%;
      border: 1px solid #444444;
      border-radius: 10px;
      margin: 5px 0px;
    }

    .list {
      color: #e9e9e9;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 3px;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        padding: 6px 8px;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        user-select: none;

        svg {
          z-index: 1;
          transition: all 0.3s ease;
        }
        &:hover {
          background: #333333;
        }

        .label {
          font-weight: 400;
          transition: all 0.2s ease;
        }

        &.delete {
          color: #e3616a;
          position: relative;
          &:hover {
            background: #6b2c2b;
          }

          .label {
            transform: translateY(0);
          }

          &:active {
            .label {
              opacity: 0;
              visibility: hidden;
              transform: translateY(100%) translateX(-15px) scale(0.8);
            }
            .action {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }

            &:before {
              animation: delete 2.5s ease-in-out forwards 0.2s;
            }
          }

          .action {
            position: absolute;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-50%) translateX(-15px) scale(0.8);
          }

          &::before {
            content: "";
            position: absolute;
            background-color: #89302d;
            left: 0;
            top: 0;
            height: 100%;
          }
        }
      }
    }
  }

  @keyframes delete {
    from {
      width: 0%;
    }

    to {
      width: 100%;
    }
  }`;

export default ActionCard;
