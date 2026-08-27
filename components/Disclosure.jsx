/**
 * Mention obligatoire d'affiliation Amazon (visible, non masquée).
 * À conserver sur chaque page contenant des liens affiliés.
 */
export default function Disclosure() {
  return (
    <div className="disclosure" role="note">
      <p>
        <strong>Transparence :</strong> cette page contient des liens affiliés Amazon.
        Si vous achetez un produit via ces liens, nous percevons une petite commission,
        <strong> sans aucun surcoût pour vous</strong>. En tant que Partenaire Amazon,
        nous réalisons un bénéfice sur les achats remplissant les conditions requises.
      </p>
    </div>
  );
}
