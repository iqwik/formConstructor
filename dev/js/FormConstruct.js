export default class FormConstruct {
    constructor(containerID, ajaxSource){
        this.containerID = containerID;
        this.ajaxSource = ajaxSource;
        this.addButtons = [
            {id: "input", text: "Добавить Input"},
            {id: "textarea", text: "Добавить Textarea"},
            {id: "checkbox", text: "Добавить Checkbox"},
            {id: "radio", text: "Добавить Radio"},
            {id: "select", text: "Добавить Select"},
        ];
        this.clickedButton = 'none';
        this.controlFormID = 'control_form';
        this.blockFieldsID = 'block_fields';
        this.checkBlockClass = 'checks_block';
        this.formDoneID = 'formDone';
        this.changeChecks = {
            'add':{'id':'addCheck','text':'Добавить опцию'},
            'remove':{'id':'removeCheck','text':'Удалить опцию'}
        };
        this.fieldState = {
            field: [],
            input: ['label','id','name','placeholder'],
            checkbox: ['label','id','value'],
            select: ['name','id','text'],
            option: ['value','text'],
            checkTypes: ['checkbox','radio','select'],
            defaultCount: 1,
            count: 1,
            maxCount: 10,
            minCount: 1,
        };

        this._build();
    }
    _build(){
        this._renderControlButtons();
        this._renderControlFormBlock();
        this._renderFinalFormBlock();
        this._handleClickButton();
        this._hadleSubmitFinalForm();
    }
    _renderControlButtons(){
        let container = document.getElementById(this.containerID);

        let divButtons = document.createElement('div');
        container.appendChild(divButtons);
        divButtons.classList.add('control_block');

        let ul = document.createElement('ul');
        divButtons.appendChild(ul);
        ul.classList.add('control_ul');
        let li = '';
        this.addButtons.map((item) => {
            li += `<li class="control_li"><button id="${item.id}">${item.text}</button></li>`;
        });
        ul.innerHTML = li;
    }
    _renderControlFormBlock(){
        let container = document.getElementById(this.containerID);
        let controlForm = document.createElement('div');
        container.appendChild(controlForm);
        controlForm.id = this.controlFormID;
    }
    _renderFinalFormBlock(){
        let container = document.getElementById(this.containerID);
        let finalForm = document.createElement('form');
        container.appendChild(finalForm);
        finalForm.id = this.formDoneID;
    }
    _handleClickButton(){
        this.addButtons.map(item => {
            let btn = document.getElementById(item.id);
            btn.addEventListener('click', (e) => {
                this.clickedButton = e.target.id;
                if(this.clickedButton !== 'none'){
                    this._renderFields();
                }
            });
        });
    }
    _renderFields(){
        let containerForm = document.getElementById(this.controlFormID);
        let blockFieldsID = this.blockFieldsID;
        containerForm.innerHTML = `<form id="${blockFieldsID}"><h3>${this.clickedButton}</h3></form>`;

        let form = document.getElementById(blockFieldsID);
        let div = document.createElement('div');
        form.appendChild(div);
        div.classList.add('form_fields');
        div.innerHTML = this._addFields();
        this._handleAddInput();
        this._handleRemoveInput();

        let button = document.createElement('button');
        button.type = 'submit';
        form.appendChild(button);
        button.classList.add('addField');
        button.innerHTML = 'Добавить в Форму';

        this._handleSubmitField(form);
    }
    _addFields(){
        return this.fieldState.checkTypes.indexOf(this.clickedButton) !== -1
            ? this._getChecks()
            : this._getFieldsById();
    }
    _getChecks(){
        return `<div class="${this.checkBlockClass}">${this._renderCheck()}</div>
                <button id="${this.changeChecks.add.id}">${this.changeChecks.add.text}</button>
                <button id="${this.changeChecks.remove.id}">${this.changeChecks.remove.text}</button>`;
    }
    _renderCheck(){
        let id = this.clickedButton;
        let inputs = [];
        let fields = id === 'select'
            ? this.fieldState.option
            : this.fieldState.checkbox;

        inputs.push(this._getFieldsById());
        for (let i = 1; i <= this.fieldState.count; i++) {
            inputs.push(this._getFieldsById(fields));
        }

        let inp = '';
        inputs.map((e,i) => inp += `<div class="_checks opt_${i}">${e}</div>` );
        return inp;
    }
    _getFieldsById(arr = this.fieldState.select){
        let id = this.clickedButton;
        let fields = (id === 'input' || id === 'textarea')
            ? this.fieldState.input
            : arr;

        let res = '';
        fields.map(elem =>
            res += `<input type="text" name=${elem} class="_${elem}" placeholder="${elem}" />`);
        return res;
    }
    _handleSubmitField(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            let buttonId = this.clickedButton;
            const { count, checkTypes } = this.fieldState;

            let formFields = e.target.elements;
            let obj = {};
            let arr = [];
            let x = 0;

            if(checkTypes.indexOf(buttonId) !== -1)
            {
                obj['select'] = {};
                obj['option'] = [];
                for (let j = 0; j <= count; j++) {
                    arr[j] = {};
                    let checksDiv = document.querySelector(`.opt_${j}`).childNodes;
                    if(checksDiv.length > 0) {
                        for (let n = 0; n < checksDiv.length; n++) {
                            arr[j][checksDiv[n].name] = checksDiv[n].value;
                        }
                    }
                }
                arr.splice(0, 1);
            }
            obj['option'] = arr;

            for(let i=0; i < formFields.length - 1; i++){
                if(buttonId === 'input' || buttonId === 'textarea'){
                    obj[formFields[i].name] = formFields[i].value;
                } else {
                    if (i < 3) {
                        obj['select'][formFields[i].name] = formFields[i].value;
                    }
                }
                formFields[i].value = '';
                x++
            }

            if(x > 0) {
                obj['type'] = buttonId;
                this.fieldState.field = [...this.fieldState.field, obj];
            }
            let controlFormID = document.getElementById(this.controlFormID);
            controlFormID.innerHTML = '';
            this.fieldState.count = this.fieldState.defaultCount;
            this._buildForm();
        });
    }
    _buildForm(){
        let formDone = document.getElementById(this.formDoneID);
        let html = '<h2>Your Form</h2>';
        this.fieldState.field.map((el,i) => html += `<div>${this._renderFormField(el,i)}</div>`);
        html += '<button type="submit">Отправить</button>';
        formDone.innerHTML = html;
    }
    _renderFormField(elem, idx){
        let field = '';
        if (elem.type === 'input') {
            let label = this._getFieldValue(elem.label);
            let name = this._getName('input', elem.name);
            let id = this._getFieldValue(elem.id);
            let placeholder = this._getFieldValue(elem.placeholder, true);

            field += `<label>${label}
                        <input name="${name}" id="${id}" placeholder="${placeholder}" />
                      </label>`;

        } else if (elem.type === 'textarea') {
            let label = this._getFieldValue(elem.label);
            let name = this._getName('textarea', elem.name);
            let id = this._getFieldValue(elem.id);
            let placeholder = this._getFieldValue(elem.placeholder, true);

            field += `<label>${label}
                        <textarea name="${name}" id="${id}" placeholder="${placeholder}"></textarea>
                      </label>`;

        } else {
            field += `<h4>${this._getFieldValue(elem.select.text, false, true)}</h4>
                      <div>
                          ${elem.type === 'select'
                              ? this._getFormSelect(elem.option, elem.select.id, elem.select.name, elem.type)
                              : this._getFormChecks(elem.option, elem.type, elem.select.name)}
                      </div>`;
        }

        return field;
    }
    _getFieldValue(value, placeholder = false, label = false, index = -1){
        let text = '';
        if(placeholder !== false) {
            text = 'Placeholder';
        } else if(label !== false && index < 0){
            text = 'Your Choice';
        } else if(label !== false && index > -1){
            text = `Option ${index + 1}`;
        }

        return (typeof value === 'undefined' || value === '')
            ? text
            : value;
    }
    _getName(type, name) {
        let timestamp = Date.now() + this._getRandomInt(1, 1000);
        let defaultName =  `${type}_${timestamp}`;
        return (typeof name === 'undefined' || name === '') ? defaultName : name;
    }
    _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    _getFormChecks(arr, type, name){
        let res = '';
        let defName = this._getName(type, name);
         arr.map((e,i) => {
            let id = this._getFieldValue(e.id) === '' ? this._getName(type, name) : e.id;
            let label = this._getFieldValue(e.label, false, true, i);
            let value = this._getFieldValue(e.value) === '' ? id : this._getFieldValue(e.value);

            res += `<label for="${id}">
                        <input type="${type}" name="${defName}" id="${id}" value="${value}"/>
                        ${label}
                    </label>`
         });
        return res;
    };
    _getFormSelect(arr, id, name, type){
        let optionList = '';
        let newId = this._getFieldValue(id) === '' ? this._getName(type, name) : id;
        let newName = this._getName(type, name);
        arr.map((e,i) => {
            let optValue = this._getFieldValue(e.value, false, true, i);
            let optText = this._getFieldValue(e.text) === '' ? optValue : this._getFieldValue(e.text);
            optionList += `<option value="${optValue}">${optText}</option>`;
        });
        return `<select id="${newId}" name="${newName}">${optionList}</select>`;
    };
    _hadleSubmitFinalForm(){
        let formID = document.getElementById(this.formDoneID);
        if(formID) {
            formID.addEventListener('submit', (e) => {
                e.preventDefault();
                let formFields = e.target.elements;
                let obj = {};
                let checks = [];
                let checkName = '';

                for (let i = 0; i < formFields.length - 1; i++) {
                    if (formFields[i].value.length > 0) {
                        if(formFields[i].type === 'checkbox' && formFields[i].checked){
                            checkName = formFields[i].name;
                            checks.push(formFields[i].value);
                        } else {
                            obj[formFields[i].name] = formFields[i].value;
                        }
                    }
                }
                if(checks.length > 0) {
                    obj[checkName] = checks;
                }
                this._sendForm(obj);
            });
        }
    }
    _sendForm(obj) {
        console.log(obj);
        fetch(this.ajaxSource, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {"Content-type":"application/json"}
        })
            .then(response => {
                if (response.status !== 200) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                let res = data.status === '200'
                    ? 'Данные сохранены в БД'
                    : 'Что-то пошло не так... :(';
                let formDone = document.getElementById(this.formDoneID);
                formDone.innerHTML = '';
                setTimeout(() => {alert(res)}, 100);
            });
    }
    _handleAddInput(){
        let addBtn = document.getElementById(this.changeChecks.add.id);
        if(addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let i = this.fieldState.count;
                if(i < this.fieldState.maxCount){
                    i++;
                    this.fieldState.count = i;
                }
                let checksBlock = document.querySelector(`.${this.checkBlockClass}`);
                checksBlock.innerHTML = this._renderCheck();
            });
        }
    }
    _handleRemoveInput(){
        let removeBtn = document.getElementById(this.changeChecks.remove.id);
        if(removeBtn){
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let i = this.fieldState.count;
                if(i > this.fieldState.minCount){
                    i--;
                    this.fieldState.count = i;
                }
                let checksBlock = document.querySelector(`.${this.checkBlockClass}`);
                checksBlock.innerHTML = this._renderCheck();
            });
        }
    }
}