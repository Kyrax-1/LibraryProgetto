import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BooksForm from './BooksForm';

export default function FormAccordion() {
  return (
    <Accordion className="bg-white rounded-xl shadow-md mb-6">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="form-content"
        id="form-header"
      >
        <h2 className="font-semibold text-indigo-700">Aggiungi un libro</h2>
      </AccordionSummary>
      <AccordionDetails>
       <BooksForm></BooksForm>
      </AccordionDetails>
    </Accordion>
  );
}
