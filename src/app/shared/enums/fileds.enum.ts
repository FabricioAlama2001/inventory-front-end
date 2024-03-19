export enum UsersFormEnum {
  email = 'Correo electrónico',
  identification = 'Número de documento',
  identificationType = 'Tipo de documento',
  lastname = 'Apellidos',
  name = 'Nombres',
  password = 'Contraseña',
  passwordChanged = 'Confirmar contraseña',
  roles = 'Roles',
  unitManagers = 'Unidades ejecutoras',
  bloodType = 'Tipo de sangre',
  ethnicOrigin = 'Etnia',
}

export enum SubactivitiesFormEnum {
  activity = 'Actividad',
  name = 'Nombre',
  project = 'Proyecto',
  expenseType = 'Tipo de gasto',
  budgetItem = 'Item presupuestario',
  fundingSource = 'Fuente de financiamiento',
  component = 'Componente',
  type = 'Tipo',
  enabled = 'Estado',
  fiscalYear = 'Año fiscal',
  indicatorSubactivity = 'Indicador de la subactividad',
  institutionalStrategicPlan = 'Plan estratégico institucional',
  strategicAxis = 'Eje estratégico',
  strategy = 'Estrategia',
  continent = 'Continente',
  country = 'País',
  province = 'Provincia',
  canton = 'Cantón',
  parish = 'Parroquia',
  poa = 'Fuente de finaciamiento - Item presupuestario',
  unit = 'Unidad ejecutora'
}

export enum ProjectsFormEnum {
  code= 'Código',
  name= 'Nombre',
  fiscalYear = 'Año Fiscal',
  enabled = 'Estado',
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
  sort = 'Orden',
  pndPolice = 'Politica'
}

export enum StrategicAxesFormEnum {
  institutionalStrategicPlan = 'Plan estratégico institucional',
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
  sort = 'Orden'
}

export enum StrategiesFormEnum {
  strategicAxis = 'Eje estratégico',
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
  executor = '¿Es unidad ejecutora?',
  level = 'Nivel',
  enabled = 'Estado',
  parent = 'Padre',
  principal = 'Principal'
}

export enum PoasFormEnum {
  activity = 'Actividad',
  budgetItem = 'Item presupuestario',
  fundingSource = 'Fuente de financiamiento',
  expenseType = 'Tipo de gasto'
}

export enum ProgrammingTypesFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
}

export enum DocumentTypesFormEnum {
  code = 'Código',
  name = 'Nombre',
  description ='Descripción',
  acronym ='Acronimo',
  sort ='Orden',
  enabled = 'Estado'
}

export enum ApplicationStatusFormEnum {
  code = 'Código',
  name = 'Nombre',
  enabled = 'Estado',
}

export enum TransactionsFormEnum {
  code = 'Código',
  subject = 'Asunto',
  esigef = 'ESIGEF',
  value = 'Valor',
  isIva = 'Tiene IVA',
  description = 'Descripción',
  enabled = 'Estado',
  state = 'Estado transacción',
  documentType = 'Tipo de documento',
  applicationStatus = 'Estado de la solicitud',
  parent = 'Transacción principal',
  process = 'Proceso transaccional',
  fiscalYear = 'Año fiscal',
  unit = 'Unidad ejecutora',
  principalUnit = 'Unidad principal'
}

export enum UnitManagersFormEnum {
  code = 'Código',
  date = 'Fecha',
  enabled = 'Estado',
  user = 'Usuario',
  role = 'Rol',
  unit = 'Unidad ejecutora'
}

export enum TransactionDetailsFormEnum {
  amount = 'Monto',
  advance = 'Avance',
  cur = 'CUR',
  goal = 'Meta',
  date = 'Fecha',
  isIva = '¿Tiene IVA?',
  enabled = 'Estado',
  state = 'Estado transacción',
  documentType = 'Tipo de documento',
  process = 'Proceso transaccional',
  transaction = 'Transacción',
  unit = 'Unidad ejecutora',
  principalUnit = 'Unidad principal',
  subactivity = 'Sub-actividad',
  programmingType = 'Tipo de programacón'
}
