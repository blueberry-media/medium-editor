/*global MediumEditor, describe, it, expect, spyOn,
         afterEach, beforeEach, selectElementContents,
         jasmine, fireEvent, tearDown,
         selectElementContentsAndFire */

describe('Buttons TestCase', function () {
    'use strict';

    beforeEach(function () {
        this.el = document.createElement('div');
        this.el.className = 'editor';
        this.el.innerHTML = 'lorem ipsum';
        document.body.appendChild(this.el);
    });

    afterEach(function () {
        tearDown(this.el);
    });

    describe('Button Initial State', function () {
        beforeEach(function () {
            jasmine.clock().install();
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('should activate button if selection already has the element', function () {
            var button,
                editor = new MediumEditor('.editor');
            this.el.innerHTML = '<b>lorem ipsum</b>';
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="bold"]');
            expect(button.className).toContain('medium-editor-button-active');
        });
    });

    describe('Button click', function () {
        beforeEach(function () {
            jasmine.clock().install();
        });

        it('should set active class on click', function () {
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="bold"]');
            fireEvent(button, 'click');
            expect(button.className).toContain('medium-editor-button-active');
        });

        it('should check for selection when selection is undefined', function () {
            spyOn(MediumEditor.prototype, 'checkSelection');
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="bold"]');
            editor.selection = undefined;
            fireEvent(button, 'click');
            expect(editor.checkSelection).toHaveBeenCalled();
        });

        it('should remove active class if button has it', function () {
            this.el.innerHTML = '<b>lorem ipsum</b>';
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="bold"]');
            expect(button.className).toContain('medium-editor-button-active');
            fireEvent(button, 'click');
            expect(button.className).not.toContain('medium-editor-button-active');
        });

        it('should execute the button action', function () {
            spyOn(MediumEditor.prototype, 'execAction');
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="bold"]');
            fireEvent(button, 'click');
            expect(editor.execAction).toHaveBeenCalled();
        });

        it('should call the execCommand for native actions', function () {
            spyOn(document, 'execCommand').and.callThrough();
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="italic"]');
            fireEvent(button, 'click');
            expect(document.execCommand).toHaveBeenCalled();
            // IE won't generate an `<i>` tag here. it generates an `<em>`:
            expect(this.el.innerHTML).toMatch(/(<i>|<em>)lorem ipsum(<\/i>|<\/em>)/);
        });

        it('should execute the button action', function () {
            spyOn(MediumEditor.prototype, 'execAction');
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="bold"]');
            fireEvent(button, 'click');
            expect(editor.execAction).toHaveBeenCalled();
        });

        it('should call the triggerAnchorAction method when button element is "a"', function () {
            spyOn(MediumEditor.prototype, 'triggerAnchorAction');
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="anchor"]');
            fireEvent(button, 'click');
            expect(editor.triggerAnchorAction).toHaveBeenCalled();
        });
    });

    describe('AppendEl', function () {
        beforeEach(function () {
            jasmine.clock().install();
        });

        it('should call the execFormatBlock method when button action is append', function () {
            spyOn(MediumEditor.prototype, 'execFormatBlock');
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="append-h3"]');
            fireEvent(button, 'click');
            expect(editor.execFormatBlock).toHaveBeenCalled();
        });

        it('should create an h3 element when header1 is clicked', function () {
            this.el.innerHTML = '<p><b>lorem ipsum</b></p>';
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0]);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="append-h3"]');
            fireEvent(button, 'click');
            // depending on the styling you have,
            // IE might strip the <b> out when it applies the H3 here.
            // so, make the <b> match optional in the output:
            expect(this.el.innerHTML).toMatch(/<h3>(<b>)?lorem ipsum(<\/b>)?<\/h3>/);
        });

        it('should get back to a p element if parent element is the same as the action', function () {
            this.el.innerHTML = '<h3><b>lorem ipsum</b></h3>';
            var button,
                editor = new MediumEditor('.editor');
            selectElementContentsAndFire(editor.elements[0].firstChild);
            jasmine.clock().tick(1);
            button = editor.toolbar.querySelector('[data-action="append-h3"]');
            fireEvent(button, 'click');
            expect(this.el.innerHTML).toBe('<p><b>lorem ipsum</b></p>');
        });
    });

    describe('First and Last', function () {
        it('should add a special class to the first and last buttons', function () {
            var editor = new MediumEditor('.editor'),
                buttons = editor.toolbar.querySelectorAll('button');
            expect(buttons[0].className).toContain('medium-editor-button-first');
            expect(buttons[1].className).not.toContain('medium-editor-button-first');
            expect(buttons[1].className).not.toContain('medium-editor-button-last');
            expect(buttons[buttons.length - 1].className).toContain('medium-editor-button-last');
        });
    });
});
