AUI.add(
	'liferay-ddl-form-builder-layout-serializer',
	function(A) {
		var LayoutSerializer = A.Component.create(
			{
				ATTRS: {
					builder: {
						value: {}
					},

					columnHandler: {
						valueFn: '_valueColumnHandler'
					},

					defaultLanguageId: {
						value: themeDisplay.getDefaultLanguageId()
					},

					fieldHandler: {
						valueFn: '_valueFieldHandler'
					},

					pageHandler: {
						valueFn: '_valuePageHandler'
					},

					rowHandler: {
						valueFn: '_valueRowHandler'
					}
				},

				EXTENDS: Liferay.DDL.LayoutVisitor,

				NAME: 'liferay-ddl-form-builder-layout-serializer',

				prototype: {
					serialize: function() {
						var instance = this;

						return A.JSON.stringify(
							{
								defaultLanguageId: instance.get('defaultLanguageId'),
								pages: instance.visit()
							}
						);
					},

					_serializeColumn: function(column) {
						var instance = this;

						var serializedColumn = {
							size: column.get('size')
						};

						var fieldNames = [];

						var fieldsList = column.get('value');

						if (fieldsList) {
							fieldNames = instance._visitFields(fieldsList.get('fields'));
						}

						serializedColumn.fieldNames = fieldNames;

						return serializedColumn;
					},

					_serializeField: function(field) {
						var instance = this;

						return field.get('fieldName');
					},

					_serializePage: function(page, index) {
						var instance = this;

						var builder = instance.get('builder');

						var pages = builder.get('pages');

						var descriptions = pages.get('descriptions');
						var titles = pages.get('titles');

						var languageId = instance.get('defaultLanguageId');

						var description = {};

						description[languageId] = descriptions[index] || '';

						var title = {};

						title[languageId] = titles[index] || '';

						return {
							description: description,
							rows: instance._visitRows(page.get('rows')),
							title: title
						};
					},

					_serializeRow: function(row) {
						var instance = this;

						return {
							columns: instance._visitColumns(row.get('cols'))
						};
					},

					_valueColumnHandler: function() {
						var instance = this;

						return instance._serializeColumn;
					},

					_valueFieldHandler: function() {
						var instance = this;

						return instance._serializeField;
					},

					_valuePageHandler: function() {
						var instance = this;

						return instance._serializePage;
					},

					_valueRowHandler: function() {
						var instance = this;

						return instance._serializeRow;
					},

					_visitRows: function(rows) {
						var instance = this;

						return LayoutSerializer.superclass._visitRows.apply(instance, arguments).filter(
							function(item) {
								return item.columns.filter(
									function(column) {
										return column.fieldNames.length > 0;
									}
								).length > 0;
							}
						);
					}
				}
			}
		);

		Liferay.namespace('DDL').LayoutSerializer = LayoutSerializer;
	},
	'',
	{
		requires: ['liferay-ddl-form-builder-layout-visitor']
	}
);