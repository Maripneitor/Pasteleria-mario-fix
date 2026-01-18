import React from 'react';
import styled from 'styled-components';
import { Home, Search, User, LogOut, FileText, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const RadioMenu = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <StyledWrapper>
            <div className="menu">
                <a onClick={() => navigate('/dashboard')} className={`link ${isActive('/dashboard') ? 'active' : ''}`}>
                    <span className="link-icon">
                        <Home size={24} />
                    </span>
                    <span className="link-title">Home</span>
                </a>
                <a onClick={() => navigate('/folios')} className={`link ${isActive('/folios') ? 'active' : ''}`}>
                    <span className="link-icon">
                        <FileText size={24} />
                    </span>
                    <span className="link-title">Pedidos</span>
                </a>
                <a onClick={() => navigate('/calendario')} className={`link ${isActive('/calendario') ? 'active' : ''}`}>
                    <span className="link-icon">
                        <Search size={24} /> {/* Using Search as generic 'Find/Calendar' placeholder or stick to Calendar icon */}
                        {/* Actually let's use Search for now as per fragment, but mapping to Calendar makes sense if we want search */}
                    </span>
                    <span className="link-title">Buscar</span>
                </a>
                <a onClick={() => {/* Profile logic */ }} className="link">
                    <span className="link-icon">
                        <User size={24} />
                    </span>
                    <span className="link-title">Perfil</span>
                </a>
                <a onClick={onLogout} className="link">
                    <span className="link-icon">
                        <LogOut size={24} />
                    </span>
                    <span className="link-title">Salir</span>
                </a>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .menu {
    padding: 0.5rem;
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: center;
    border-radius: 15px;
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.075);
    gap: 10px;
  }

  .link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 50px;
    border-radius: 8px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transform-origin: center left;
    transition: width 0.2s ease-in;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    
    &:before {
      position: absolute;
      z-index: -1;
      content: "";
      display: block;
      border-radius: 8px;
      width: 100%;
      height: 100%;
      top: 0;
      transform: translateX(100%);
      transition: transform 0.2s ease-in;
      transform-origin: center right;
      background-color: #eee;
    }

    &:hover,
    &:focus,
    &.active {
      outline: 0;
      width: 130px;

      &:before,
      .link-title {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }

  .link-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
  }

  .link-title {
    transform: translateX(100%);
    transition: transform 0.2s ease-in;
    opacity: 0;
    margin-left: 30px;
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
  }
`;

export default RadioMenu;
