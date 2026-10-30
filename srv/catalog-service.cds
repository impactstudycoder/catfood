using catfood as db from '../db/schema';

service CatalogService {
    entity Products as projection on db.Products;
    // entity city as projection on db.city;
}
