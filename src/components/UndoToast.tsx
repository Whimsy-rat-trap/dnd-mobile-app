import React from 'react';
import './UndoToast.css';

interface Props {
    message: string;
    /** Label for the action button. Defaults to "Undo". */
    actionLabel?: string;
    onAction: () => void;
    /** Optional secondary callback, e.g. to dismiss the toast early. */
    onDismiss?: () => void;
}

/**
 * Generic bottom-anchored snackbar for reversible destructive actions.
 * Timer / lifetime is owned by the caller; this component is stateless.
 */
const UndoToast: React.FC<Props> = ({ message, actionLabel = 'Undo', onAction, onDismiss }) => {
    return (
        <div className="undo-toast" role="status" aria-live="polite">
            <span className="undo-toast-message">{message}</span>
            <button
                type="button"
                className="undo-toast-action"
                onClick={() => {
                    onAction();
                    onDismiss?.();
                }}
            >
                {actionLabel}
            </button>
        </div>
    );
};

export default UndoToast;
