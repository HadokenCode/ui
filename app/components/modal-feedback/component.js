import Ember from 'ember';
import C from 'ui/utils/constants';
import ModalBase from 'lacsso/components/modal-base';
import { loadScript } from 'ui/utils/load-script';

export default ModalBase.extend({
  classNames: ['lacsso', 'modal-container', 'span-8', 'offset-2', 'modal-welcome'],
  settings: Ember.inject.service(),
  prefs: Ember.inject.service(),

  loading: true,

  init() {
    this._super(...arguments);
    let self = this;

    let opt = JSON.parse(this.get(`settings.${C.SETTING.FEEDBACK_FORM}`)||'{}');

    Ember.run.scheduleOnce('afterRender', this, function() {
      loadScript('//js.hsforms.net/forms/v2.js').then(() => {
        window['hbspt'].forms.create({
          css: '',
          portalId: opt.portalId, // '468859',
          formId: opt.formId, // 'bfca2d1d-ed50-4ed7-a582-3f0440f236ca',
          target: '#feedback-form',
          errorClass: 'form-control',
          onFormReady: function() {
            self.styleForm();
            self.set('loading',false);
          },
          onFormSubmit: function() {
            self.styleForm();
            Ember.run.later(() =>  {
              self.send('sent');
            }, 1000);
          },
        }); 
      });
    });
  },

  styleForm() {
    let form = $('#feedback-form');

    form.find('.field').not('.hs_sandbox_acknowledgement').addClass('col-md-6');
    form.find('.field.hs_sandbox_acknowledgement').addClass('span-12');

    form.find('INPUT[type=text],INPUT[type=email],SELECT').addClass('form-control');
    form.find('LABEL').addClass('r-pt10');

    form.find('INPUT[type=submit]').addClass('hide');

    form.find('UL').addClass('list-unstyled');
    form.find('INPUT[type=checkbox]').addClass('r-mr10');
    form.find('.hs-form-booleancheckbox-display').css('font-weight', 'normal');
  },

  actions: {
    submit() {
      let form = $('#feedback-form');
      form.find('INPUT[type=submit]').click();
    },

    sent() {
      this.set(`prefs.${C.PREFS.FEEDBACK}`,'sent');
      this.send('cancel');
    },
  },
});
