import { ReactElement } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";

interface DetailsModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    detailsMap: Record<string, string | undefined>;
    footerContent?: ReactElement;
    closeBtnValue?: string;
    addButtons?: ButtonProps[]
}

export const DetailsModal = (props: DetailsModalProps) => {
    return (
        <Modal show={ props.show } onHide={ props.onHide }>
            <Modal.Header closeButton>
                <Modal.Title>{ props.title }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="gap-2">
                    { Object.keys(props.detailsMap).map((key, idx, array) => {
                        return (
                            <div key={ key } className={ `row ps-3 ${idx < array.length - 1 ? "mb-2" : ""}` }>
                                <span className="col fw-bold">{ key }</span>
                                <span className="col-6">{ props.detailsMap[key] }</span>
                            </div>
                        );
                    }) }
                </div>
            </Modal.Body>
            <Modal.Footer>
                { props.footerContent
                    || <Button variant="secondary" onClick={ props.onHide }>
                        Fermer</Button>
                }
            </Modal.Footer>
        </Modal>
    );
};
