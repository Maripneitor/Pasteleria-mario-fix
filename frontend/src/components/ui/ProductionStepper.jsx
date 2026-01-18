import React from 'react';
import styled from 'styled-components';

const ProductionStepper = ({ currentStep = 2, steps = [
    { title: "Pedido Recibido", time: "10:24 AM", status: "Completado" },
    { title: "En Producción", time: "02:15 PM", status: "En Proceso" },
    { title: "Terminado", time: "Estimado: 4:00 PM", status: "Pendiente" }
] }) => {
    return (
        <StyledWrapper>
            <div className="stepper-box">
                {steps.map((step, index) => {
                    let statusClass = "stepper-pending";
                    if (index + 1 < currentStep) statusClass = "stepper-completed";
                    else if (index + 1 === currentStep) statusClass = "stepper-active";

                    return (
                        <div key={index} className={`stepper-step ${statusClass}`}>
                            <div className="stepper-circle">
                                {index + 1 < currentStep ? (
                                    <svg viewBox="0 0 16 16" className="bi bi-check-lg" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div className="stepper-line" />
                            <div className="stepper-content">
                                <div className="stepper-title">{step.title}</div>
                                <div className="stepper-status">{step.status}</div>
                                <div className="stepper-time">{step.time}</div>
                            </div>
                        </div>
                    );
                })}

                <div className="stepper-controls">
                    <button className="stepper-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                        Anterior
                    </button>
                    <button className="stepper-button stepper-button-primary">
                        Siguiente
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                        </svg>
                    </button>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .stepper-box {
    background-color: white;
    border-radius: 12px;
    padding: 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .stepper-step {
    display: flex;
    margin-bottom: 32px;
    position: relative;
  }

  .stepper-step:last-child {
    margin-bottom: 0;
  }

  .stepper-line {
    position: absolute;
    left: 19px;
    top: 40px;
    bottom: -32px;
    width: 2px;
    background-color: #e2e8f0;
    z-index: 1;
  }

  .stepper-step:last-child .stepper-line {
    display: none;
  }

  .stepper-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    z-index: 2;
    background-color: white;
  }

  .stepper-completed .stepper-circle {
    background-color: #0f172a;
    color: white;
  }

  .stepper-active .stepper-circle {
    border: 2px solid #0f172a;
    color: #0f172a;
  }

  .stepper-pending .stepper-circle {
    border: 2px solid #e2e8f0;
    color: #94a3b8;
  }

  .stepper-content {
    flex: 1;
  }

  .stepper-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .stepper-completed .stepper-title {
    color: #0f172a;
  }

  .stepper-active .stepper-title {
    color: #0f172a;
  }

  .stepper-pending .stepper-title {
    color: #94a3b8;
  }

  .stepper-status {
    font-size: 13px;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    margin-top: 4px;
  }

  .stepper-completed .stepper-status {
    background-color: #dcfce7;
    color: #166534;
  }

  .stepper-active .stepper-status {
    background-color: #dbeafe;
    color: #1d4ed8;
  }

  .stepper-pending .stepper-status {
    background-color: #f1f5f9;
    color: #64748b;
  }

  .stepper-time {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
  }

  .stepper-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
  }

  .stepper-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background-color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stepper-button-primary {
    background-color: #0f172a;
    color: white;
    border-color: #0f172a;
  }`;

export default ProductionStepper;
