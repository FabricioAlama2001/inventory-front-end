export enum UsersFormEnum {
  email = 'Correo electrónico:',
  identification = 'Número de documento:',
  identificationType = 'Tipo de documento:',
  lastname = 'Apellidos:',
  name = 'Nombres:',
  password = 'Contraseña:',
  passwordChanged = 'Confirmar contraseña:',
  roles = 'Roles:',
  bloodType = 'Tipo de sangre:',
  ethnicOrigin = 'Etnia:',
}

export enum SubactivitiesFormEnum {
  name = 'Nombre',
  type = 'Tipo',
  enabled = 'Disponible',
  fiscalYear = 'Año fiscal',
  indicatorSubactivity = 'Indicador de la sub-actividad',
  institutionalStrategicPlan = 'Plan estrategico institucional',
  strategicAxis = 'Eje estrategico',
  strategy = 'Estrategia',
  continent = 'Continente',
  country = 'Pais',
  province = 'Provincia',
  canton = 'Canton',
  parish = 'Parroquia',
  poa = 'POA',
  unit = 'unidad'
}

export enum ProjectsFormEnum {
  name= 'Nombre',
  fiscalYear = 'Año Fiscal',
  enabled = 'Disponible',
  pndObjective = 'Objetivo',
  pndPolice = 'Politica',
  expenseType = 'Tipo de gasto',
}

export enum BudgetItemsFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden',
  expenseGroup = 'Grupo de gasto'
}

export enum ExpenseGroupsFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum ExpenseTypesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum PndObjectivesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum PndPolicesFormEnum {
  pndObjective = 'Objetivo',
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum IndicatorComponentsFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum FundingSourcesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum InstitutionalStrategicPlansFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum StrategicAxesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum StrategiesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum IndicatorSubactivitiesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum ContinentsFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum ComponentsFormEnum {
  indicatorComponent = 'Indicador',
  project = 'Proyecto',
  code = 'Código',
  name = 'Nombre',
  fiscalYear = 'Año fiscal',
  enabled = 'Estado',
}

export enum ActivitiesFormEnum {
  component = 'Componente',
  code = 'Código',
  name = 'Nombre',
  fiscalYear = 'Año fiscal',
  enabled = 'Estado',
}

export enum FiscalYearsFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden',
  year = 'Año'
}

export enum UnitsFormEnum {
  acronym = 'Acronimo',
  name = 'Nombre',
  executer = 'Unidad ejecutora',
  level = 'Nivel',
  enabled = 'Estado'
}

export enum PoasFormEnum {
  activity = 'Actividad',
  budgetItem = 'Item presupuestario',
  fundingSource = 'Fuente de financiamiento',
  expenseType = 'Tipo de gasto'
}
