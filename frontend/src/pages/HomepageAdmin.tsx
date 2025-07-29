import FormAccordion from "../components/AccordionForm";
import BooksList from "../components/BooksList";

export default function HomepageAdmin() {
    return (
       <div>
         {/* Form gestione libri */ }
        < section className = "mb-10" >
            <FormAccordion></FormAccordion>
        </section >

        {/* Lista libri */ }
        < section >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista Libri</h2>
          <BooksList />
        </section >
       </div>
 );
}