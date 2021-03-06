import { hash } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  userStore: service('user-store'),
  catalog: service(),

  model() {
    return hash({
      drivers: this.get('userStore').findAll('machinedriver', null, {forceReload: true}),
      catalogDrivers: this.get('catalog').fetchTemplates({templateBase: 'machine', category: 'all', allowFailure: true}),
    }).then((hash) => {
      return hash;
    });
  },
});
