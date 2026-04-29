import { Traveller } from './travellerModel.js';
import { Travel } from './travelModel.js';
import { Travels } from './travelsModel.js';

// Configures the N:M relationship between Traveller and Travel
Traveller.belongsToMany(Travel, {
    through: Travels,
    foreignKey: 'traveller_id',
    otherKey: 'travel_id',
});

Travel.belongsToMany(Traveller, {
    through: Travels,
    foreignKey: 'travel_id',
    otherKey: 'traveller_id',
});

// Configures the 1:N relationship between Traveller and Travels
Traveller.hasMany(Travels, {
    foreignKey: 'traveller_id',
});
Travels.belongsTo(Traveller, {
    foreignKey: 'traveller_id',
});

// Configures the 1:N relationship between Travel and Travels
Travel.hasMany(Travels, {
    foreignKey: 'travel_id',
});
Travels.belongsTo(Travel, {
    foreignKey: 'travel_id',
});

export { Traveller, Travel, Travels };
