import I18n from 'i18n';
import Editor from 'editor/index';

describe('I18n', () => {
  describe('Main', () => {
    let obj;
    let editor = Editor().init();
    let em = editor.getModel();

    beforeEach(() => {
      obj = I18n();
      obj.init({ em });
    });

    test('Object exists', () => {
      expect(obj).toBeTruthy();
    });

    test('getConfig method', () => {
      expect(obj.getConfig()).toBeTruthy();
    });

    test('Default local', () => {
      expect(obj.getLocale()).toBeTruthy();
    });

    test('Init with config', () => {
      const locale = 'it';
      const localeFallback = 'it';
      const msg = 'Hello!!!';
      obj.init({
        em,
        locale,
        localeFallback,
        messages: {
          en: { msg }
        }
      });
      expect(obj.getLocale()).toBe(locale);
      expect(obj.getConfig().localeFallback).toBe(localeFallback);
      expect(obj.getLocale()).toBe(locale);
    });

    test('setLocale and getLocale methods', () => {
      const localeBefore = obj.getLocale();
      const localeNew = `${localeBefore}2`;
      obj.setLocale(localeNew);
      expect(obj.getLocale()).toBe(localeNew);
    });

    test('Default messages', () => {
      expect(obj.getMessages()).toBeTruthy();
    });

    test('setMessages method', () => {
      const set1 = { en: { msg1: 'Msg 1' } };
      obj.setMessages(set1);
      expect(obj.getMessages()).toEqual(set1);
      const set2 = { en: { msg2: 'Msg 2' } };
      obj.setMessages(set2);
      expect(obj.getMessages()).toEqual(set2);
    });

    test('addMessages method', () => {
      const set1 = { en: { msg1: 'Msg 1', msg2: 'Msg 2' } };
      obj.setMessages(set1);
      const set2 = {
        en: { msg2: 'Msg 2 up', msg3: 'Msg 3' },
        it: { msg1: 'Msg 1' }
      };
      obj.addMessages(set2);
      expect(obj.getMessages()).toEqual({
        en: { msg1: 'Msg 1', msg2: 'Msg 2 up', msg3: 'Msg 3' },
        it: { msg1: 'Msg 1' }
      });
    });

    test('Translate method with global locale', () => {
      const msg1 = 'Msg 1';
      obj.setLocale('en');
      obj.setMessages({
        en: { msg1 },
        it: { msg1: `${msg1} it` }
      });
      expect(obj.t('msg2', { noWarn: 1 })).toBe(undefined);
      expect(obj.t('msg1')).toBe(msg1);
    });

    test('Translate method with object structure', () => {
      const opts = { noWarn: 1 };
      const msg1 = 'Msg level 1';
      const msg2 = 'Msg level 2';
      obj.setLocale('en');
      obj.setMessages({
        en: {
          key1: {
            msg1,
            key2: {
              msg2
            }
          }
        }
      });
      expect(obj.t('key1.msg1')).toBe(msg1);
      expect(obj.t('key1.key2.msg2')).toBe(msg2);
      expect(obj.t('key1.key2.msg3', opts)).toBe(undefined);
      expect(obj.t('key1.key3.msg2', opts)).toBe(undefined);
    });

    test('Translate method with custom locale', () => {
      const msg1 = 'Msg 1';
      const msg1Alt = `${msg1} it`;
      obj.setLocale('en');
      obj.setMessages({
        en: { msg1 },
        it: { msg1: msg1Alt }
      });
      expect(obj.t('msg1', { l: 'it' })).toBe(msg1Alt);
    });

    test('Translate method with fallback locale', () => {
      const msg1 = 'Msg en';
      obj.setLocale('it');
      obj.setMessages({
        en: { msg1 },
        it: {}
      });
      expect(obj.t('msg1')).toBe(msg1);
    });

    test('Translate method with a param', () => {
      const msg1 = 'Msg 1 {test}';
      const msg1Alt = `${msg1} it`;
      obj.setLocale('en');
      obj.setMessages({
        en: { msg1 },
        it: { msg1: msg1Alt }
      });
      expect(obj.t('msg1', { params: { test: 'Hello' } })).toBe('Msg 1 Hello');
      expect(obj.t('msg1', { l: 'it', params: { test: 'Hello' } })).toBe(
        'Msg 1 Hello it'
      );
    });

    test('i18n events', () => {
      const handlerAdd = jest.fn();
      const handlerUpdate = jest.fn();
      const handlerLocale = jest.fn();
      em.on('i18n:add', handlerAdd);
      em.on('i18n:update', handlerUpdate);
      em.on('i18n:locale', handlerLocale);
      obj.addMessages({ en: { msg1: 'Msg 1', msg2: 'Msg 2' } });
      obj.setLocale('it');
      expect(handlerAdd).toBeCalledTimes(1);
      expect(handlerUpdate).toBeCalledTimes(1);
      expect(handlerLocale).toBeCalledTimes(1);
    });
  });
});
