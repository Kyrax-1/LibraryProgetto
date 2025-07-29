import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BooksForm from './BooksForm';
import { useState } from 'react';

export default function FormAccordion() {
  const [expanded, setExpanded] = useState(false); 

  const handleChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleFormSubmitSuccess = () => {
    setExpanded(false); // chiude accordion
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange} className="bg-white rounded-xl shadow-md mb-6">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="form-content"
        id="form-header"
      >
        <h2 className="font-semibold text-indigo-700">Aggiungi un libro</h2>
      </AccordionSummary>
      <AccordionDetails>
        <BooksForm onSubmitSuccess={handleFormSubmitSuccess} />
      </AccordionDetails>
    </Accordion>
  );
}
