interface CustomButton {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  disabled?: boolean;
  className?: string;
}

interface StageContainerProps {
  handleBack?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  handleNext?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  nextCondition?: boolean;
  customButtons?: CustomButton[];
  children?: React.ReactNode;
}

export default function StageContainer({
  handleBack,
  handleNext,
  nextCondition = true,
  customButtons,
  children,
}: StageContainerProps) {
  return (
    <div className="container">
      {children}
      <div className="btn-container">
        {handleBack && (
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
        )}
        {handleNext && (
          <button
            className="next-btn"
            disabled={!nextCondition}
            onClick={handleNext}
          >
            Next
          </button>
        )}
        {customButtons?.map(
          ({ label, disabled, onClick, className }, index) => (
            <button
              key={index}
              className={className}
              onClick={onClick}
              disabled={disabled}
            >
              {label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
