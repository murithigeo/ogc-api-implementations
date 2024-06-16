export interface Root {
    openapi: string
    info: Info
    servers: Server[]
    tags: Tag[]
    paths: Paths
  }
  
  export interface Info {
    title: string
    description: string
    version: string
    license: License
  }
  
  export interface License {
    name: string
    url: string
  }
  
  export interface Server {
    url: string
    description: string
  }
  
  export interface Tag {
    name: string
    description: string
  }
  
  export interface Paths {
    "/": GeneratedType
    "/conformance": Conformance
    "/collections": Collections
    "/collections/{collectionId}": CollectionsCollectionId
    "/collections/{collectionId}/position": CollectionsCollectionIdPosition
    "/collections/{collectionId}/radius": CollectionsCollectionIdRadius
    "/collections/{collectionId}/area": CollectionsCollectionIdArea
    "/collections/{collectionId}/cube": CollectionsCollectionIdCube
    "/collections/{collectionId}/trajectory": CollectionsCollectionIdTrajectory
    "/collections/{collectionId}/corridor": CollectionsCollectionIdCorridor
    "/collections/{collectionId}/items": CollectionsCollectionIdItems
    "/collections/{collectionId}/items/{itemId}": CollectionsCollectionIdItemsItemId
    "/collections/{collectionId}/instances": CollectionsCollectionIdInstances
    "/collections/{collectionId}/instances/{instanceId}/position": CollectionsCollectionIdInstancesInstanceIdPosition
    "/collections/{collectionId}/instances/{instanceId}/radius": CollectionsCollectionIdInstancesInstanceIdRadius
    "/collections/{collectionId}/instances/{instanceId}/area": CollectionsCollectionIdInstancesInstanceIdArea
    "/collections/{collectionId}/instances/{instanceId}/cube": CollectionsCollectionIdInstancesInstanceIdCube
    "/collections/{collectionId}/instances/{instanceId}/trajectory": CollectionsCollectionIdInstancesInstanceIdTrajectory
    "/collections/{collectionId}/instances/{instanceId}/corridor": CollectionsCollectionIdInstancesInstanceIdCorridor
    "/collections/{collectionId}/locations": CollectionsCollectionIdLocations
    "/collections/{collectionId}/locations/{locId}": CollectionsCollectionIdLocationsLocId
    "/collections/{collectionId}/instances/{instanceId}/locations": CollectionsCollectionIdInstancesInstanceIdLocations
    "/collections/{collectionId}/instances/{instanceId}/locations/{locId}": CollectionsCollectionIdInstancesInstanceIdLocationsLocId
  }
  
  export interface GeneratedType {
    get: Get
  }
  
  export interface Get {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter[]
    responses: Responses
  }
  
  export interface Parameter {
    name: string
    in: string
    description: string
    required: boolean
    schema: Schema
  }
  
  export interface Schema {
    type: string
  }
  
  export interface Responses {
    "200": N200
  }
  
  export interface N200 {
    description: string
    content: Content
  }
  
  export interface Content {
    "application/json": ApplicationJson
    "text/html": TextHtml
  }
  
  export interface ApplicationJson {
    schema: Schema2
  }
  
  export interface Schema2 {
    type: string
    required: string[]
    properties: Properties
  }
  
  export interface Properties {
    title: Title
    description: Description
    links: Links
    keywords: Keywords
    provider: Provider
    contact: Contact
  }
  
  export interface Title {
    type: string
    example: string
  }
  
  export interface Description {
    type: string
    example: string
  }
  
  export interface Links {
    type: string
    items: Items
    example: Example[]
  }
  
  export interface Items {
    type: string
    required: string[]
    properties: Properties2
  }
  
  export interface Properties2 {
    href: Href
    rel: Rel
    type: Type
    hreflang: Hreflang
    title: Title2
    length: Length
    templated: Templated
  }
  
  export interface Href {
    type: string
    example: string
  }
  
  export interface Rel {
    type: string
    example: string
  }
  
  export interface Type {
    type: string
    example: string
  }
  
  export interface Hreflang {
    type: string
    example: string
  }
  
  export interface Title2 {
    type: string
    example: string
  }
  
  export interface Length {
    type: string
  }
  
  export interface Templated {
    description: string
    type: string
  }
  
  export interface Example {
    href: string
    hreflang: string
    rel: string
    type: string
    title: string
  }
  
  export interface Keywords {
    type: string
    items: Items2
    example: string[]
  }
  
  export interface Items2 {
    type: string
  }
  
  export interface Provider {
    type: string
    properties: Properties3
  }
  
  export interface Properties3 {
    name: Name
    url: Url
  }
  
  export interface Name {
    description: string
    type: string
  }
  
  export interface Url {
    description: string
    type: string
  }
  
  export interface Contact {
    type: string
    properties: Properties4
  }
  
  export interface Properties4 {
    email: Email
    phone: Phone
    fax: Fax
    hours: Hours
    instructions: Instructions
    address: Address
    postalCode: PostalCode
    city: City
    stateorprovince: Stateorprovince
    country: Country
  }
  
  export interface Email {
    description: string
    type: string
  }
  
  export interface Phone {
    description: string
    type: string
  }
  
  export interface Fax {
    description: string
    type: string
  }
  
  export interface Hours {
    type: string
  }
  
  export interface Instructions {
    type: string
  }
  
  export interface Address {
    type: string
  }
  
  export interface PostalCode {
    type: string
  }
  
  export interface City {
    type: string
  }
  
  export interface Stateorprovince {
    type: string
  }
  
  export interface Country {
    type: string
  }
  
  export interface TextHtml {
    schema: Schema3
  }
  
  export interface Schema3 {
    type: string
  }
  
  export interface Conformance {
    get: Get2
  }
  
  export interface Get2 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter2[]
    responses: Responses2
  }
  
  export interface Parameter2 {
    $ref: string
  }
  
  export interface Responses2 {
    "200": N2002
  }
  
  export interface N2002 {
    description: string
    content: Content2
  }
  
  export interface Content2 {
    "application/json": ApplicationJson2
    "text/html": TextHtml2
  }
  
  export interface ApplicationJson2 {
    schema: Schema4
  }
  
  export interface Schema4 {
    type: string
    required: string[]
    properties: Properties5
  }
  
  export interface Properties5 {
    conformsTo: ConformsTo
  }
  
  export interface ConformsTo {
    type: string
    items: Items3
  }
  
  export interface Items3 {
    type: string
  }
  
  export interface TextHtml2 {
    schema: Schema5
  }
  
  export interface Schema5 {
    type: string
  }
  
  export interface Collections {
    get: Get3
  }
  
  export interface Get3 {
    tags: string[]
    summary: string
    operationId: string
    parameters: Parameter3[]
    responses: Responses3
  }
  
  export interface Parameter3 {
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema6
    style?: string
    explode?: boolean
    $ref?: string
  }
  
  export interface Schema6 {
    oneOf?: OneOf[]
    type?: string
  }
  
  export interface OneOf {
    items: Items4
    type: string
  }
  
  export interface Items4 {
    minItems: number
    maxItems: number
    type: string
  }
  
  export interface Responses3 {
    "200": N2003
    default: Default
  }
  
  export interface N2003 {
    description: string
    content: Content3
  }
  
  export interface Content3 {
    "application/json": ApplicationJson3
    "text/html": TextHtml3
  }
  
  export interface ApplicationJson3 {
    schema: Schema7
  }
  
  export interface Schema7 {
    type: string
    required: string[]
    properties: Properties6
  }
  
  export interface Properties6 {
    links: Links2
    collections: Collections2
  }
  
  export interface Links2 {
    type: string
    items: Items5
    example: Example2[]
  }
  
  export interface Items5 {
    $ref: string
  }
  
  export interface Example2 {
    href: string
    hreflang: string
    rel: string
    type: string
  }
  
  export interface Collections2 {
    type: string
    items: Items6
  }
  
  export interface Items6 {
    $ref: string
  }
  
  export interface TextHtml3 {
    schema: Schema8
  }
  
  export interface Schema8 {
    type: string
  }
  
  export interface Default {
    description: string
    content: Content4
  }
  
  export interface Content4 {
    "application/json": ApplicationJson4
    "text/html": TextHtml4
  }
  
  export interface ApplicationJson4 {
    schema: Schema9
  }
  
  export interface Schema9 {
    type: string
    required: string[]
    properties: Properties7
  }
  
  export interface Properties7 {
    code: Code
    description: Description2
  }
  
  export interface Code {
    type: string
  }
  
  export interface Description2 {
    type: string
  }
  
  export interface TextHtml4 {
    schema: Schema10
  }
  
  export interface Schema10 {
    type: string
  }
  
  export interface CollectionsCollectionId {
    get: Get4
  }
  
  export interface Get4 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter4[]
    responses: Responses4
  }
  
  export interface Parameter4 {
    $ref: string
  }
  
  export interface Responses4 {
    "200": N2004
    default: Default2
  }
  
  export interface N2004 {
    description: string
    content: Content5
  }
  
  export interface Content5 {
    "application/json": ApplicationJson5
    "text/html": TextHtml5
  }
  
  export interface ApplicationJson5 {
    schema: Schema11
  }
  
  export interface Schema11 {
    type: string
    required: string[]
    properties: Properties8
  }
  
  export interface Properties8 {
    links: Links3
    id: Id
    title: Title3
    description: Description3
    keywords: Keywords2
    extent: Extent
    data_queries: DataQueries
    crs: Crs3
    output_formats: OutputFormats8
    parameter_names: ParameterNames
  }
  
  export interface Links3 {
    type: string
    items: Items7
    example: Example3[]
  }
  
  export interface Items7 {
    $ref: string
  }
  
  export interface Example3 {
    href: string
    hreflang: string
    rel: string
    type: string
    title: string
  }
  
  export interface Id {
    description: string
    type: string
    example: string
  }
  
  export interface Title3 {
    description: string
    type: string
    example: string
  }
  
  export interface Description3 {
    description: string
    type: string
    example: string
  }
  
  export interface Keywords2 {
    description: string
    type: string
    items: Items8
  }
  
  export interface Items8 {
    type: string
  }
  
  export interface Extent {
    description: string
    type: string
    properties: Properties9
  }
  
  export interface Properties9 {
    spatial: Spatial
    temporal: Temporal
    vertical: Vertical
  }
  
  export interface Spatial {
    description: string
    type: string
    required: string[]
    properties: Properties10
  }
  
  export interface Properties10 {
    bbox: Bbox
    crs: Crs
    name: Name2
  }
  
  export interface Bbox {
    description: string
    type: string
    minItems: number
    items: Items9
    example: number[]
  }
  
  export interface Items9 {
    description: string
    oneOf: OneOf2[]
  }
  
  export interface OneOf2 {
    items: Items10
    minItems: number
    maxItems: number
    type: string
  }
  
  export interface Items10 {
    type: string
  }
  
  export interface Crs {
    description: string
    type: string
    default: string
  }
  
  export interface Name2 {
    description: string
    type: string
  }
  
  export interface Temporal {
    description: string
    type: string
    required: string[]
    properties: Properties11
  }
  
  export interface Properties11 {
    interval: Interval
    values: Values
    trs: Trs
    name: Name3
  }
  
  export interface Interval {
    description: string
    type: string
    minItems: number
    items: Items11
  }
  
  export interface Items11 {
    description: string
    type: string
    minItems: number
    maxItems: number
    items: Items12
    example: string[][]
  }
  
  export interface Items12 {
    type: string
    format: string
    nullable: boolean
  }
  
  export interface Values {
    description: string
    type: string
    minItems: number
    items: Items13
  }
  
  export interface Items13 {
    type: string
    minItems: number
    format: string
    nullable: boolean
    example: string[][]
  }
  
  export interface Trs {
    description: string
    type: string
    example: string
    default: string
  }
  
  export interface Name3 {
    description: string
    type: string
  }
  
  export interface Vertical {
    description: string
    type: string
    required: string[]
    properties: Properties12
  }
  
  export interface Properties12 {
    interval: Interval2
    values: Values2
    vrs: Vrs
    name: Name4
  }
  
  export interface Interval2 {
    description: string
    type: string
    minItems: number
    items: Items14
  }
  
  export interface Items14 {
    description: string
    type: string
    minItems: number
    items: Items15
    example: string[][]
  }
  
  export interface Items15 {
    type: string
    nullable: boolean
  }
  
  export interface Values2 {
    description: string
    type: string
    minItems: number
    items: Items16
  }
  
  export interface Items16 {
    type: string
    nullable: boolean
    example: string[][]
  }
  
  export interface Vrs {
    description: string
    type: string
    example: string
    default: string
  }
  
  export interface Name4 {
    description: string
    type: string
  }
  
  export interface DataQueries {
    description: string
    type: string
    properties: Properties13
  }
  
  export interface Properties13 {
    position: Position
    radius: Radius
    area: Area
    cube: Cube
    trajectory: Trajectory
    corridor: Corridor
    locations: Locations
    items: Items35
  }
  
  export interface Position {
    type: string
    properties: Properties14
  }
  
  export interface Properties14 {
    link: Link
  }
  
  export interface Link {
    allOf: AllOf[]
    properties: Properties15
  }
  
  export interface AllOf {
    $ref: string
  }
  
  export interface Properties15 {
    href: Href2
    variables: Variables
  }
  
  export interface Href2 {
    type: string
    example: string
  }
  
  export interface Variables {
    description: string
    type: string
    properties: Properties16
  }
  
  export interface Properties16 {
    title: Title4
    description: Description4
    query_type: QueryType
    output_formats: OutputFormats
    default_output_format: DefaultOutputFormat
    crs_details: CrsDetails
  }
  
  export interface Title4 {
    description: string
    type: string
    example: string
  }
  
  export interface Description4 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface OutputFormats {
    description: string
    type: string
    items: Items17
    example: string[]
  }
  
  export interface Items17 {
    type: string
  }
  
  export interface DefaultOutputFormat {
    description: string
    type: string
  }
  
  export interface CrsDetails {
    description: string
    type: string
    items: Items18
  }
  
  export interface Items18 {
    $ref: string
  }
  
  export interface Radius {
    type: string
    properties: Properties17
  }
  
  export interface Properties17 {
    link: Link2
  }
  
  export interface Link2 {
    allOf: AllOf2[]
    properties: Properties18
  }
  
  export interface AllOf2 {
    $ref: string
  }
  
  export interface Properties18 {
    href: Href3
    variables: Variables2
  }
  
  export interface Href3 {
    type: string
    example: string
  }
  
  export interface Variables2 {
    description: string
    type: string
    properties: Properties19
  }
  
  export interface Properties19 {
    title: Title5
    description: Description5
    query_type: QueryType2
    within_units: WithinUnits
    output_formats: OutputFormats2
    default_output_format: DefaultOutputFormat2
    crs_details: CrsDetails2
  }
  
  export interface Title5 {
    description: string
    type: string
    example: string
  }
  
  export interface Description5 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType2 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface WithinUnits {
    description: string
    type: string
    items: Items19
    example: string[]
  }
  
  export interface Items19 {
    type: string
  }
  
  export interface OutputFormats2 {
    description: string
    type: string
    items: Items20
    example: string[]
  }
  
  export interface Items20 {
    type: string
  }
  
  export interface DefaultOutputFormat2 {
    description: string
    type: string
  }
  
  export interface CrsDetails2 {
    description: string
    type: string
    items: Items21
  }
  
  export interface Items21 {
    $ref: string
  }
  
  export interface Area {
    type: string
    properties: Properties20
  }
  
  export interface Properties20 {
    link: Link3
  }
  
  export interface Link3 {
    allOf: AllOf3[]
    properties: Properties21
  }
  
  export interface AllOf3 {
    $ref: string
  }
  
  export interface Properties21 {
    href: Href4
    variables: Variables3
  }
  
  export interface Href4 {
    type: string
    example: string
  }
  
  export interface Variables3 {
    description: string
    type: string
    properties: Properties22
  }
  
  export interface Properties22 {
    title: Title6
    description: Description6
    query_type: QueryType3
    output_formats: OutputFormats3
    default_output_format: DefaultOutputFormat3
    crs_details: CrsDetails3
  }
  
  export interface Title6 {
    description: string
    type: string
    example: string
  }
  
  export interface Description6 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType3 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface OutputFormats3 {
    description: string
    type: string
    items: Items22
    example: string[]
  }
  
  export interface Items22 {
    type: string
  }
  
  export interface DefaultOutputFormat3 {
    description: string
    type: string
  }
  
  export interface CrsDetails3 {
    description: string
    type: string
    items: Items23
  }
  
  export interface Items23 {
    type: string
    required: string[]
    properties: Properties23
  }
  
  export interface Properties23 {
    crs: Crs2
    wkt: Wkt
  }
  
  export interface Crs2 {
    description: string
    type: string
    example: string
  }
  
  export interface Wkt {
    description: string
    type: string
    example: string
  }
  
  export interface Cube {
    type: string
    properties: Properties24
  }
  
  export interface Properties24 {
    link: Link4
  }
  
  export interface Link4 {
    allOf: AllOf4[]
    properties: Properties25
  }
  
  export interface AllOf4 {
    $ref: string
  }
  
  export interface Properties25 {
    href: Href5
    variables: Variables4
  }
  
  export interface Href5 {
    type: string
    example: string
  }
  
  export interface Variables4 {
    description: string
    type: string
    properties: Properties26
  }
  
  export interface Properties26 {
    title: Title7
    description: Description7
    query_type: QueryType4
    height_units: HeightUnits
    output_formats: OutputFormats4
    default_output_format: DefaultOutputFormat4
    crs_details: CrsDetails4
  }
  
  export interface Title7 {
    description: string
    type: string
    example: string
  }
  
  export interface Description7 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType4 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface HeightUnits {
    description: string
    type: string
    items: Items24
    example: string[]
  }
  
  export interface Items24 {
    type: string
  }
  
  export interface OutputFormats4 {
    description: string
    type: string
    items: Items25
    example: string[]
  }
  
  export interface Items25 {
    type: string
  }
  
  export interface DefaultOutputFormat4 {
    description: string
    type: string
  }
  
  export interface CrsDetails4 {
    description: string
    type: string
    items: Items26
  }
  
  export interface Items26 {
    $ref: string
  }
  
  export interface Trajectory {
    type: string
    properties: Properties27
  }
  
  export interface Properties27 {
    link: Link5
  }
  
  export interface Link5 {
    allOf: AllOf5[]
    properties: Properties28
  }
  
  export interface AllOf5 {
    $ref: string
  }
  
  export interface Properties28 {
    href: Href6
    variables: Variables5
  }
  
  export interface Href6 {
    type: string
    example: string
  }
  
  export interface Variables5 {
    description: string
    type: string
    properties: Properties29
  }
  
  export interface Properties29 {
    title: Title8
    description: Description8
    query_type: QueryType5
    output_formats: OutputFormats5
    default_output_format: DefaultOutputFormat5
    crs_details: CrsDetails5
  }
  
  export interface Title8 {
    description: string
    type: string
    example: string
  }
  
  export interface Description8 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType5 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface OutputFormats5 {
    description: string
    type: string
    items: Items27
    example: string[]
  }
  
  export interface Items27 {
    type: string
  }
  
  export interface DefaultOutputFormat5 {
    description: string
    type: string
  }
  
  export interface CrsDetails5 {
    description: string
    type: string
    items: Items28
  }
  
  export interface Items28 {
    $ref: string
  }
  
  export interface Corridor {
    type: string
    properties: Properties30
  }
  
  export interface Properties30 {
    link: Link6
  }
  
  export interface Link6 {
    allOf: AllOf6[]
    properties: Properties31
  }
  
  export interface AllOf6 {
    $ref: string
  }
  
  export interface Properties31 {
    href: Href7
    variables: Variables6
  }
  
  export interface Href7 {
    type: string
    example: string
  }
  
  export interface Variables6 {
    description: string
    type: string
    properties: Properties32
  }
  
  export interface Properties32 {
    title: Title9
    description: Description9
    query_type: QueryType6
    width_units: WidthUnits
    height_units: HeightUnits2
    output_formats: OutputFormats6
    default_output_format: DefaultOutputFormat6
    crs_details: CrsDetails6
  }
  
  export interface Title9 {
    description: string
    type: string
    example: string
  }
  
  export interface Description9 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType6 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface WidthUnits {
    description: string
    type: string
    items: Items29
    example: string[]
  }
  
  export interface Items29 {
    type: string
  }
  
  export interface HeightUnits2 {
    description: string
    type: string
    items: Items30
    example: string[]
  }
  
  export interface Items30 {
    type: string
  }
  
  export interface OutputFormats6 {
    description: string
    type: string
    items: Items31
    example: string[]
  }
  
  export interface Items31 {
    type: string
  }
  
  export interface DefaultOutputFormat6 {
    description: string
    type: string
  }
  
  export interface CrsDetails6 {
    description: string
    type: string
    items: Items32
  }
  
  export interface Items32 {
    $ref: string
  }
  
  export interface Locations {
    type: string
    properties: Properties33
  }
  
  export interface Properties33 {
    link: Link7
  }
  
  export interface Link7 {
    allOf: AllOf7[]
    properties: Properties34
  }
  
  export interface AllOf7 {
    $ref: string
  }
  
  export interface Properties34 {
    href: Href8
    variables: Variables7
  }
  
  export interface Href8 {
    type: string
    example: string
  }
  
  export interface Variables7 {
    description: string
    type: string
    properties: Properties35
  }
  
  export interface Properties35 {
    title: Title10
    description: Description10
    query_type: QueryType7
    output_formats: OutputFormats7
    default_output_format: DefaultOutputFormat7
    crs_details: CrsDetails7
  }
  
  export interface Title10 {
    description: string
    type: string
    example: string
  }
  
  export interface Description10 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType7 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface OutputFormats7 {
    description: string
    type: string
    items: Items33
    example: string[]
  }
  
  export interface Items33 {
    type: string
  }
  
  export interface DefaultOutputFormat7 {
    description: string
    type: string
  }
  
  export interface CrsDetails7 {
    description: string
    type: string
    items: Items34
  }
  
  export interface Items34 {
    $ref: string
  }
  
  export interface Items35 {
    type: string
    properties: Properties36
  }
  
  export interface Properties36 {
    link: Link8
  }
  
  export interface Link8 {
    allOf: AllOf8[]
    properties: Properties37
  }
  
  export interface AllOf8 {
    $ref: string
  }
  
  export interface Properties37 {
    href: Href9
    variables: Variables8
  }
  
  export interface Href9 {
    type: string
    example: string
  }
  
  export interface Variables8 {
    description: string
    type: string
    properties: Properties38
  }
  
  export interface Properties38 {
    title: Title11
    description: Description11
    query_type: QueryType8
  }
  
  export interface Title11 {
    description: string
    type: string
    example: string
  }
  
  export interface Description11 {
    description: string
    type: string
    example: string
  }
  
  export interface QueryType8 {
    description: string
    type: string
    enum: string[]
    example: string
  }
  
  export interface Crs3 {
    description: string
    type: string
    items: Items36
  }
  
  export interface Items36 {
    type: string
  }
  
  export interface OutputFormats8 {
    description: string
    type: string
    items: Items37
    example: string[]
  }
  
  export interface Items37 {
    type: string
  }
  
  export interface ParameterNames {
    description: string
    type: string
    additionalProperties: AdditionalProperties
  }
  
  export interface AdditionalProperties {
    items: Items38
  }
  
  export interface Items38 {
    type: string
    title: string
    description: string
    required: string[]
    properties: Properties39
    example: Example7
  }
  
  export interface Properties39 {
    type: Type2
    description: Description12
    label: Label
    "data-type": DataType
    unit: Unit
    observedProperty: ObservedProperty
    categoryEncoding: CategoryEncoding
    extent: Extent2
    id: Id5
    measurementType: MeasurementType
  }
  
  export interface Type2 {
    description: string
    enum: string[]
  }
  
  export interface Description12 {
    type: string
  }
  
  export interface Label {
    type: string
  }
  
  export interface DataType {
    description: string
    type: string
    enum: string[]
  }
  
  export interface Unit {
    type: string
    title: string
    description: string
    anyOf: AnyOf[]
    properties: Properties40
    example: Example5
  }
  
  export interface AnyOf {
    required: string[]
  }
  
  export interface Properties40 {
    label: Label2
    symbol: Symbol
    id: Id2
  }
  
  export interface Label2 {
    additionalProperties: AdditionalProperties2
  }
  
  export interface AdditionalProperties2 {
    type: string
  }
  
  export interface Symbol {
    title: string
    oneOf: OneOf3[]
    example: Example4
  }
  
  export interface OneOf3 {
    type: string
    description?: string
    required?: string[]
    properties?: Properties41
  }
  
  export interface Properties41 {
    value: Value
    type: Type3
  }
  
  export interface Value {
    description: string
    type: string
  }
  
  export interface Type3 {
    description: string
    type: string
  }
  
  export interface Example4 {
    value: string
    type: string
  }
  
  export interface Id2 {
    type: string
  }
  
  export interface Example5 {
    label: Label3
    symbol: Symbol2
  }
  
  export interface Label3 {
    en: string
  }
  
  export interface Symbol2 {
    value: string
    type: string
  }
  
  export interface ObservedProperty {
    type: string
    title: string
    description: string
    required: string[]
    properties: Properties42
    example: Example6
  }
  
  export interface Properties42 {
    id: Id3
    label: Label4
    description: Description13
    categories: Categories
  }
  
  export interface Id3 {
    description: string
    type: string
  }
  
  export interface Label4 {
    oneOf: OneOf4[]
  }
  
  export interface OneOf4 {
    type: string
  }
  
  export interface Description13 {
    type: string
  }
  
  export interface Categories {
    type: string
    items: Items39
  }
  
  export interface Items39 {
    minItems: number
    type: string
    required: string[]
    properties: Properties43
  }
  
  export interface Properties43 {
    id: Id4
    label: Label5
    description: Description14
  }
  
  export interface Id4 {
    description: string
    type: string
  }
  
  export interface Label5 {
    oneOf: OneOf5[]
  }
  
  export interface OneOf5 {
    type: string
  }
  
  export interface Description14 {
    oneOf: OneOf6[]
  }
  
  export interface OneOf6 {
    type: string
    required?: string[]
    properties?: Properties44
  }
  
  export interface Properties44 {
    en: En
  }
  
  export interface En {
    type: string
  }
  
  export interface Example6 {
    id: string
    label: string
  }
  
  export interface CategoryEncoding {
    type: string
    additionalProperties: AdditionalProperties3
  }
  
  export interface AdditionalProperties3 {
    oneOf: OneOf7[]
  }
  
  export interface OneOf7 {
    type: string
    items?: Items40
  }
  
  export interface Items40 {
    type: string
  }
  
  export interface Extent2 {
    $ref: string
  }
  
  export interface Id5 {
    description: string
    type: string
  }
  
  export interface MeasurementType {
    type: string
    title: string
    description: string
    required: string[]
    properties: Properties45
  }
  
  export interface Properties45 {
    method: Method
    duration: Duration
  }
  
  export interface Method {
    type: string
    example: string
  }
  
  export interface Duration {
    type: string
    title: string
    description: string
    example: string
  }
  
  export interface Example7 {
    type: string
    id: string
    description: string
    unit: Unit2
    observedProperty: ObservedProperty2
  }
  
  export interface Unit2 {
    label: string
    symbol: Symbol3
  }
  
  export interface Symbol3 {
    value: string
    type: string
  }
  
  export interface ObservedProperty2 {
    id: string
    label: string
  }
  
  export interface TextHtml5 {
    schema: Schema12
  }
  
  export interface Schema12 {
    type: string
  }
  
  export interface Default2 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdPosition {
    get: Get5
    post: Post
  }
  
  export interface Get5 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter5[]
    responses: Responses5
  }
  
  export interface Parameter5 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema13
  }
  
  export interface Schema13 {
    type: string
  }
  
  export interface Responses5 {
    "200": N2005
    "202": N202
    "308": N308
    "400": N400
    "404": N404
    "413": N413
    default: Default3
  }
  
  export interface N2005 {
    $ref: string
  }
  
  export interface N202 {
    $ref: string
  }
  
  export interface N308 {
    $ref: string
  }
  
  export interface N400 {
    $ref: string
  }
  
  export interface N404 {
    $ref: string
  }
  
  export interface N413 {
    $ref: string
  }
  
  export interface Default3 {
    $ref: string
  }
  
  export interface Post {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter6[]
    requestBody: RequestBody
    responses: Responses6
  }
  
  export interface Parameter6 {
    $ref: string
  }
  
  export interface RequestBody {
    content: Content6
  }
  
  export interface Content6 {
    "application/json": ApplicationJson6
  }
  
  export interface ApplicationJson6 {
    schema: Schema14
  }
  
  export interface Schema14 {
    type: string
    required: string[]
    properties: Properties46
  }
  
  export interface Properties46 {
    coords: Coords
    z: Z
    datetime: Datetime
    "parameter-name": ParameterName
    crs: Crs4
    f: F
  }
  
  export interface Coords {
    description: string
    type: string
  }
  
  export interface Z {
    type: string
  }
  
  export interface Datetime {
    type: string
  }
  
  export interface ParameterName {
    type: string
    items: Items41
  }
  
  export interface Items41 {
    type: string
  }
  
  export interface Crs4 {
    type: string
  }
  
  export interface F {
    type: string
  }
  
  export interface Responses6 {
    "200": N2006
    "202": N2022
    "308": N3082
    "400": N4002
    "404": N4042
    "413": N4132
    default: Default4
  }
  
  export interface N2006 {
    $ref: string
  }
  
  export interface N2022 {
    $ref: string
  }
  
  export interface N3082 {
    $ref: string
  }
  
  export interface N4002 {
    $ref: string
  }
  
  export interface N4042 {
    $ref: string
  }
  
  export interface N4132 {
    $ref: string
  }
  
  export interface Default4 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdRadius {
    get: Get6
    post: Post2
  }
  
  export interface Get6 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter7[]
    responses: Responses7
  }
  
  export interface Parameter7 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema15
    example: any
  }
  
  export interface Schema15 {
    type: string
  }
  
  export interface Responses7 {
    "200": N2007
    "202": N2023
    "308": N3083
    "400": N4003
    "404": N4043
    "413": N4133
    default: Default5
  }
  
  export interface N2007 {
    $ref: string
  }
  
  export interface N2023 {
    $ref: string
  }
  
  export interface N3083 {
    $ref: string
  }
  
  export interface N4003 {
    $ref: string
  }
  
  export interface N4043 {
    $ref: string
  }
  
  export interface N4133 {
    $ref: string
  }
  
  export interface Default5 {
    $ref: string
  }
  
  export interface Post2 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter8[]
    requestBody: RequestBody2
    responses: Responses8
  }
  
  export interface Parameter8 {
    $ref: string
  }
  
  export interface RequestBody2 {
    content: Content7
  }
  
  export interface Content7 {
    "application/json": ApplicationJson7
  }
  
  export interface ApplicationJson7 {
    schema: Schema16
  }
  
  export interface Schema16 {
    type: string
    required: string[]
    properties: Properties47
  }
  
  export interface Properties47 {
    coords: Coords2
    within: Within
    "within-units": WithinUnits2
    z: Z2
    datetime: Datetime2
    "parameter-name": ParameterName2
    crs: Crs5
    f: F2
  }
  
  export interface Coords2 {
    description: string
    type: string
  }
  
  export interface Within {
    type: string
  }
  
  export interface WithinUnits2 {
    type: string
  }
  
  export interface Z2 {
    type: string
  }
  
  export interface Datetime2 {
    type: string
  }
  
  export interface ParameterName2 {
    type: string
    items: Items42
  }
  
  export interface Items42 {
    type: string
  }
  
  export interface Crs5 {
    type: string
  }
  
  export interface F2 {
    type: string
  }
  
  export interface Responses8 {
    "200": N2008
    "202": N2024
    "308": N3084
    "400": N4004
    "404": N4044
    "413": N4134
    default: Default6
  }
  
  export interface N2008 {
    $ref: string
  }
  
  export interface N2024 {
    $ref: string
  }
  
  export interface N3084 {
    $ref: string
  }
  
  export interface N4004 {
    $ref: string
  }
  
  export interface N4044 {
    $ref: string
  }
  
  export interface N4134 {
    $ref: string
  }
  
  export interface Default6 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdArea {
    get: Get7
    post: Post3
  }
  
  export interface Get7 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter9[]
    responses: Responses9
  }
  
  export interface Parameter9 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema17
    style?: string
    explode?: boolean
    example?: string
  }
  
  export interface Schema17 {
    items?: Items43
    type?: string
  }
  
  export interface Items43 {
    type: string
  }
  
  export interface Responses9 {
    "200": N2009
    "202": N2025
    "308": N3085
    "400": N4005
    "404": N4045
    "413": N4135
    default: Default7
  }
  
  export interface N2009 {
    description: string
    content: Content8
  }
  
  export interface Content8 {
    "application/prs.coverage+json": ApplicationPrsCoverageJson
    "application/geo+json": ApplicationGeoJson
    "application/x-netcdf": ApplicationXNetcdf
    "text/xml": TextXml
  }
  
  export interface ApplicationPrsCoverageJson {
    schema: Schema18
  }
  
  export interface Schema18 {
    type: string
    title: string
    description: string
    required: string[]
    properties: Properties48
  }
  
  export interface Properties48 {
    type: Type4
    domainType: DomainType
    coverages: Coverages
    parameters: Parameters
    ranges: Ranges2
    referencing: Referencing2
  }
  
  export interface Type4 {
    description: string
    type: string
    enum: string[]
  }
  
  export interface DomainType {
    type: string
  }
  
  export interface Coverages {
    type: string
    items: Items44
  }
  
  export interface Items44 {
    type: string
    required: string[]
    properties: Properties49
  }
  
  export interface Properties49 {
    type: Type5
    domain: Domain
    ranges: Ranges
  }
  
  export interface Type5 {
    description: string
    type: string
    enum: string[]
  }
  
  export interface Domain {
    description: string
    type: string
    properties: Properties50
    required: string[]
  }
  
  export interface Properties50 {
    type: Type6
    domainType: DomainType2
    axes: Axes
    referencing: Referencing
  }
  
  export interface Type6 {
    type: string
    enum: string[]
  }
  
  export interface DomainType2 {
    type: string
  }
  
  export interface Axes {
    type: string
    oneOf: OneOf8[]
  }
  
  export interface OneOf8 {
    description: string
    properties: Properties51
    required?: string[]
  }
  
  export interface Properties51 {
    x?: X
    y?: Y
    z?: Z3
    t?: T
    axes?: Axes2
  }
  
  export interface X {
    description: string
    oneOf: OneOf9[]
  }
  
  export interface OneOf9 {
    description: string
    allOf?: AllOf9[]
    properties?: Properties53
    required?: string[]
    additionalProperties?: boolean
  }
  
  export interface AllOf9 {
    $ref?: string
    properties?: Properties52
    additionalProperties?: boolean
  }
  
  export interface Properties52 {
    values: Values3
    bounds: Bounds
  }
  
  export interface Values3 {
    items: Items45
  }
  
  export interface Items45 {
    type: string
  }
  
  export interface Bounds {
    items: Items46
  }
  
  export interface Items46 {
    type: string
  }
  
  export interface Properties53 {
    start: Start
    stop: Stop
    num: Num
  }
  
  export interface Start {
    type: string
  }
  
  export interface Stop {
    type: string
  }
  
  export interface Num {
    type: string
    minimum: number
  }
  
  export interface Y {
    $ref: string
  }
  
  export interface Z3 {
    $ref: string
  }
  
  export interface T {
    description: string
    allOf: AllOf10[]
  }
  
  export interface AllOf10 {
    description?: string
    properties: Properties54
    required?: string[]
    additionalProperties?: boolean
  }
  
  export interface Properties54 {
    dataType?: DataType2
    values: Values4
    coordinates?: Coordinates
    bounds: Bounds2
  }
  
  export interface DataType2 {
    type: string
    not: Not
  }
  
  export interface Not {
    enum: string[]
  }
  
  export interface Values4 {
    type?: string
    minItems?: number
    uniqueItems?: boolean
    items?: Items47
  }
  
  export interface Items47 {
    type: string
  }
  
  export interface Coordinates {
    type: string
    items: Items48
    minItems: number
  }
  
  export interface Items48 {
    type: string
  }
  
  export interface Bounds2 {
    description?: string
    type?: string
    minItems?: number
    items?: Items49
  }
  
  export interface Items49 {
    type: string
  }
  
  export interface Axes2 {
    properties: Properties55
    required: string[]
  }
  
  export interface Properties55 {
    composite: Composite
    z: Z4
  }
  
  export interface Composite {
    description: string
    allOf: AllOf11[]
  }
  
  export interface AllOf11 {
    $ref?: string
    properties?: Properties56
    required?: string[]
    additionalProperties?: boolean
  }
  
  export interface Properties56 {
    dataType: DataType3
    values: Values5
    coordinates: Coordinates2
  }
  
  export interface DataType3 {
    type: string
    enum: string[]
  }
  
  export interface Values5 {
    items: Items50
  }
  
  export interface Items50 {
    description: string
    type: string
    items: Items51
    minItems: number
  }
  
  export interface Items51 {
    anyOf: AnyOf2[]
  }
  
  export interface AnyOf2 {
    type: string
  }
  
  export interface Coordinates2 {}
  
  export interface Z4 {
    $ref: string
  }
  
  export interface Referencing {
    type: string
    items: Items52
  }
  
  export interface Items52 {
    $ref: string
  }
  
  export interface Ranges {
    additionalProperties: AdditionalProperties4
  }
  
  export interface AdditionalProperties4 {
    type: string
    $ref: string
  }
  
  export interface Parameters {
    additionalProperties: AdditionalProperties5
  }
  
  export interface AdditionalProperties5 {
    type: string
    $ref: string
  }
  
  export interface Ranges2 {
    type: string
    additionalProperties: AdditionalProperties6
  }
  
  export interface AdditionalProperties6 {
    type: string
    description: string
    properties: Properties57
    oneOf: OneOf10[]
    required: string[]
  }
  
  export interface Properties57 {
    type: Type7
    dataType: DataType4
    shape: Shape
    axisNames: AxisNames
    values: Values6
  }
  
  export interface Type7 {
    type: string
    enum: string[]
  }
  
  export interface DataType4 {
    enum: string[]
  }
  
  export interface Shape {
    type: string
    items: Items53
  }
  
  export interface Items53 {
    type: string
  }
  
  export interface AxisNames {
    type: string
    items: Items54
    uniqueItems: boolean
  }
  
  export interface Items54 {
    type: string
  }
  
  export interface Values6 {
    type: string
    items: Items55
    minItems: number
  }
  
  export interface Items55 {
    type: string
    nullable: boolean
  }
  
  export interface OneOf10 {
    properties: Properties58
    required?: string[]
  }
  
  export interface Properties58 {
    values?: Values7
    shape?: Shape2
    axisNames?: AxisNames2
  }
  
  export interface Values7 {
    items: Items56
    nullable: boolean
  }
  
  export interface Items56 {
    type: string
  }
  
  export interface Shape2 {
    minItems: number
  }
  
  export interface AxisNames2 {
    minItems: number
  }
  
  export interface Referencing2 {
    type: string
    items: Items57
    minItems: number
  }
  
  export interface Items57 {
    description: string
    type: string
    properties: Properties59
    required: string[]
  }
  
  export interface Properties59 {
    coordinates: Coordinates3
    system: System
  }
  
  export interface Coordinates3 {
    type: string
    items: Items58
    minItems: number
  }
  
  export interface Items58 {
    type: string
  }
  
  export interface System {
    type: string
    properties: Properties60
    required: string[]
    oneOf: OneOf11[]
  }
  
  export interface Properties60 {
    type: Type8
  }
  
  export interface Type8 {
    type: string
  }
  
  export interface OneOf11 {
    description: string
    properties: Properties61
    required: string[]
  }
  
  export interface Properties61 {
    calendar?: Calendar
    timeScale?: TimeScale
    id?: Id6
    label?: Label6
    description?: Description15
    targetConcept?: TargetConcept
    identifiers?: Identifiers
  }
  
  export interface Calendar {
    type: string
  }
  
  export interface TimeScale {
    type: string
  }
  
  export interface Id6 {
    type: string
  }
  
  export interface Label6 {
    $ref: string
  }
  
  export interface Description15 {
    $ref: string
  }
  
  export interface TargetConcept {
    type: string
    properties: Properties62
    required: string[]
  }
  
  export interface Properties62 {
    id: Id7
    label: Label7
    description: Description16
  }
  
  export interface Id7 {
    type: string
  }
  
  export interface Label7 {
    $ref: string
  }
  
  export interface Description16 {
    $ref: string
  }
  
  export interface Identifiers {
    type: string
    additionalProperties: AdditionalProperties7
  }
  
  export interface AdditionalProperties7 {
    type: string
    properties: Properties63
    required: string[]
  }
  
  export interface Properties63 {
    id: Id8
    label: Label8
    description: Description17
  }
  
  export interface Id8 {
    type: string
  }
  
  export interface Label8 {
    $ref: string
  }
  
  export interface Description17 {
    $ref: string
  }
  
  export interface ApplicationGeoJson {
    schema: Schema19
  }
  
  export interface Schema19 {
    type: string
    required: string[]
    properties: Properties64
  }
  
  export interface Properties64 {
    type: Type9
    features: Features
    parameters: Parameters2
    links: Links5
    timeStamp: TimeStamp
    numberMatched: NumberMatched
    numberReturned: NumberReturned
  }
  
  export interface Type9 {
    type: string
    enum: string[]
  }
  
  export interface Features {
    type: string
    items: Items59
  }
  
  export interface Items59 {
    type: string
    required: string[]
    properties: Properties65
  }
  
  export interface Properties65 {
    type: Type10
    geometry: Geometry
    properties: Properties67
    id: Id9
    links: Links4
  }
  
  export interface Type10 {
    type: string
    enum: string[]
  }
  
  export interface Geometry {
    oneOf: OneOf12[]
  }
  
  export interface OneOf12 {
    type: string
    required: string[]
    properties: Properties66
  }
  
  export interface Properties66 {
    type: Type11
    coordinates?: Coordinates4
    geometries?: Geometries
  }
  
  export interface Type11 {
    type: string
    enum: string[]
  }
  
  export interface Coordinates4 {
    type: string
    minItems?: number
    items: Items60
  }
  
  export interface Items60 {
    type: string
    minItems?: number
    items?: Items61
  }
  
  export interface Items61 {
    type: string
    minItems?: number
    items?: Items62
    maxItems?: number
  }
  
  export interface Items62 {
    type: string
    minItems?: number
    items?: Items63
  }
  
  export interface Items63 {
    type: string
  }
  
  export interface Geometries {
    type: string
    items: Items64
  }
  
  export interface Items64 {
    oneOf: OneOf13[]
  }
  
  export interface OneOf13 {
    $ref: string
  }
  
  export interface Properties67 {
    type: string
    title: string
    description: string
    example: Example8[]
    required: string[]
    properties: Properties68
  }
  
  export interface Example8 {
    datetime: string
    label: string
    "parameter-name": string[]
    edrqueryendpoint: string
  }
  
  export interface Properties68 {
    datetime: Datetime3
    "parameter-name": ParameterName3
    label: Label9
    edrqueryendpoint: Edrqueryendpoint
  }
  
  export interface Datetime3 {
    type: string
    title: string
    description: string
    default: string
    example: string[]
  }
  
  export interface ParameterName3 {
    type: string
    title: string
    description: string
    items: Items65
  }
  
  export interface Items65 {
    type: string
    title: string
    description: string
    default: string
    example: string[]
  }
  
  export interface Label9 {
    type: string
    title: string
    description: string
    default: string
    example: string[]
  }
  
  export interface Edrqueryendpoint {
    type: string
    title: string
    description: string
    default: string
    example: string[]
  }
  
  export interface Id9 {
    oneOf: OneOf14[]
  }
  
  export interface OneOf14 {
    type: string
  }
  
  export interface Links4 {
    type: string
    items: Items66
  }
  
  export interface Items66 {
    $ref: string
  }
  
  export interface Parameters2 {
    description: string
    type: string
    items: Items67
  }
  
  export interface Items67 {
    type: string
    description: string
    properties: Properties69
    required: string[]
  }
  
  export interface Properties69 {
    id: Id10
    type: Type12
    description: Description18
    observedProperty: ObservedProperty3
    unit: Unit3
    categoryEncoding: CategoryEncoding2
  }
  
  export interface Id10 {
    type: string
  }
  
  export interface Type12 {
    description: string
    type: string
    enum: string[]
  }
  
  export interface Description18 {
    type: string
    description: string
    additionalProperties: AdditionalProperties8
  }
  
  export interface AdditionalProperties8 {
    type: string
  }
  
  export interface ObservedProperty3 {
    type: string
    description: string
    properties: Properties70
    required: string[]
  }
  
  export interface Properties70 {
    id: Id11
    label: Label10
    description: Description19
    categories: Categories2
  }
  
  export interface Id11 {
    type: string
  }
  
  export interface Label10 {
    $ref: string
  }
  
  export interface Description19 {
    $ref: string
  }
  
  export interface Categories2 {
    type: string
    items: Items68
    minItems: number
  }
  
  export interface Items68 {
    type: string
    properties: Properties71
    required: string[]
  }
  
  export interface Properties71 {
    id: Id12
    label: Label11
    description: Description20
  }
  
  export interface Id12 {
    type: string
  }
  
  export interface Label11 {
    $ref: string
  }
  
  export interface Description20 {
    $ref: string
  }
  
  export interface Unit3 {
    type: string
    description: string
    properties: Properties72
    anyOf: AnyOf3[]
  }
  
  export interface Properties72 {
    id: Id13
    label: Label12
    symbol: Symbol4
  }
  
  export interface Id13 {
    type: string
  }
  
  export interface Label12 {
    $ref: string
  }
  
  export interface Symbol4 {
    oneOf: OneOf15[]
  }
  
  export interface OneOf15 {
    type: string
    properties?: Properties73
    required?: string[]
  }
  
  export interface Properties73 {
    type: Type13
    value: Value2
  }
  
  export interface Type13 {
    type: string
  }
  
  export interface Value2 {
    type: string
  }
  
  export interface AnyOf3 {
    required: string[]
  }
  
  export interface CategoryEncoding2 {
    type: string
    description: string
    additionalProperties: AdditionalProperties9
  }
  
  export interface AdditionalProperties9 {
    oneOf: OneOf16[]
  }
  
  export interface OneOf16 {
    type: string
    items?: Items69
  }
  
  export interface Items69 {
    type: string
  }
  
  export interface Links5 {
    type: string
    items: Items70
  }
  
  export interface Items70 {
    $ref: string
  }
  
  export interface TimeStamp {
    description: string
    type: string
    format: string
    example: string
  }
  
  export interface NumberMatched {
    description: string
    type: string
    minimum: number
    example: number
  }
  
  export interface NumberReturned {
    type: string
    description: string
    minimum: number
    example: number
  }
  
  export interface ApplicationXNetcdf {
    schema: Schema20
  }
  
  export interface Schema20 {
    type: string
  }
  
  export interface TextXml {
    schema: Schema21
  }
  
  export interface Schema21 {
    type: string
  }
  
  export interface N2025 {
    description: string
  }
  
  export interface N3085 {
    description: string
  }
  
  export interface N4005 {
    description: string
    content: Content9
  }
  
  export interface Content9 {
    "application/json": ApplicationJson8
    "text/xml": TextXml2
  }
  
  export interface ApplicationJson8 {
    schema: Schema22
  }
  
  export interface Schema22 {
    $ref: string
  }
  
  export interface TextXml2 {}
  
  export interface N4045 {
    description: string
    content: Content10
  }
  
  export interface Content10 {
    "application/json": ApplicationJson9
    "text/xml": TextXml3
  }
  
  export interface ApplicationJson9 {
    schema: Schema23
  }
  
  export interface Schema23 {
    $ref: string
  }
  
  export interface TextXml3 {}
  
  export interface N4135 {
    description: string
    content: Content11
  }
  
  export interface Content11 {
    "application/json": ApplicationJson10
    "text/xml": TextXml4
  }
  
  export interface ApplicationJson10 {
    schema: Schema24
  }
  
  export interface Schema24 {
    $ref: string
  }
  
  export interface TextXml4 {}
  
  export interface Default7 {
    $ref: string
  }
  
  export interface Post3 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameters3
    requestBody: RequestBody3[]
    responses: Responses10
  }
  
  export interface Parameters3 {
    name: string
    in: string
    description: string
    required: boolean
    schema: Schema25
  }
  
  export interface Schema25 {
    type: string
  }
  
  export interface RequestBody3 {
    $ref: string
  }
  
  export interface Responses10 {
    "200": N20010
    "202": N2026
    "308": N3086
    "400": N4006
    "404": N4046
    "413": N4136
    default: Default8
  }
  
  export interface N20010 {
    $ref: string
  }
  
  export interface N2026 {
    $ref: string
  }
  
  export interface N3086 {
    $ref: string
  }
  
  export interface N4006 {
    $ref: string
  }
  
  export interface N4046 {
    $ref: string
  }
  
  export interface N4136 {
    $ref: string
  }
  
  export interface Default8 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdCube {
    get: Get8
    post: Post4
  }
  
  export interface Get8 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter10[]
    responses: Responses11
  }
  
  export interface Parameter10 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema26
  }
  
  export interface Schema26 {
    type: string
  }
  
  export interface Responses11 {
    "200": N20011
    "202": N2027
    "308": N3087
    "400": N4007
    "404": N4047
    "413": N4137
    default: Default9
  }
  
  export interface N20011 {
    $ref: string
  }
  
  export interface N2027 {
    $ref: string
  }
  
  export interface N3087 {
    $ref: string
  }
  
  export interface N4007 {
    $ref: string
  }
  
  export interface N4047 {
    $ref: string
  }
  
  export interface N4137 {
    $ref: string
  }
  
  export interface Default9 {
    $ref: string
  }
  
  export interface Post4 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter11[]
    requestBody: RequestBody4
    responses: Responses12
  }
  
  export interface Parameter11 {
    $ref: string
  }
  
  export interface RequestBody4 {
    content: Content12
  }
  
  export interface Content12 {
    "application/json": ApplicationJson11
  }
  
  export interface ApplicationJson11 {
    schema: Schema27
  }
  
  export interface Schema27 {
    type: string
    required: string[]
    properties: Properties74
  }
  
  export interface Properties74 {
    bbox: Bbox2
    z: Z5
    datetime: Datetime4
    "parameter-name": ParameterName4
    crs: Crs6
    f: F3
  }
  
  export interface Bbox2 {
    type: string
  }
  
  export interface Z5 {
    type: string
  }
  
  export interface Datetime4 {
    type: string
  }
  
  export interface ParameterName4 {
    type: string
    items: Items71
  }
  
  export interface Items71 {
    type: string
  }
  
  export interface Crs6 {
    type: string
  }
  
  export interface F3 {
    type: string
  }
  
  export interface Responses12 {
    "200": N20012
    "202": N2028
    "308": N3088
    "400": N4008
    "404": N4048
    "413": N4138
    default: Default10
  }
  
  export interface N20012 {
    $ref: string
  }
  
  export interface N2028 {
    $ref: string
  }
  
  export interface N3088 {
    $ref: string
  }
  
  export interface N4008 {
    $ref: string
  }
  
  export interface N4048 {
    $ref: string
  }
  
  export interface N4138 {
    $ref: string
  }
  
  export interface Default10 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdTrajectory {
    get: Get9
    post: Post5
  }
  
  export interface Get9 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter12[]
    responses: Responses13
  }
  
  export interface Parameter12 {
    $ref: string
  }
  
  export interface Responses13 {
    "200": N20013
    "202": N2029
    "308": N3089
    "400": N4009
    "404": N4049
    "413": N4139
    default: Default11
  }
  
  export interface N20013 {
    $ref: string
  }
  
  export interface N2029 {
    $ref: string
  }
  
  export interface N3089 {
    $ref: string
  }
  
  export interface N4009 {
    $ref: string
  }
  
  export interface N4049 {
    $ref: string
  }
  
  export interface N4139 {
    $ref: string
  }
  
  export interface Default11 {
    $ref: string
  }
  
  export interface Post5 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter13[]
    requestBody: RequestBody5
    responses: Responses14
  }
  
  export interface Parameter13 {
    $ref: string
  }
  
  export interface RequestBody5 {
    content: Content13
  }
  
  export interface Content13 {
    "application/json": ApplicationJson12
  }
  
  export interface ApplicationJson12 {
    schema: Schema28
  }
  
  export interface Schema28 {
    type: string
    required: string[]
    properties: Properties75
  }
  
  export interface Properties75 {
    coords: Coords3
    z: Z6
    datetime: Datetime5
    "parameter-name": ParameterName5
    crs: Crs7
    f: F4
  }
  
  export interface Coords3 {
    description: string
    type: string
  }
  
  export interface Z6 {
    type: string
  }
  
  export interface Datetime5 {
    type: string
  }
  
  export interface ParameterName5 {
    type: string
    items: Items72
  }
  
  export interface Items72 {
    type: string
  }
  
  export interface Crs7 {
    type: string
  }
  
  export interface F4 {
    type: string
  }
  
  export interface Responses14 {
    "200": N20014
    "202": N20210
    "308": N30810
    "400": N40010
    "404": N40410
    "413": N41310
    default: Default12
  }
  
  export interface N20014 {
    $ref: string
  }
  
  export interface N20210 {
    $ref: string
  }
  
  export interface N30810 {
    $ref: string
  }
  
  export interface N40010 {
    $ref: string
  }
  
  export interface N40410 {
    $ref: string
  }
  
  export interface N41310 {
    $ref: string
  }
  
  export interface Default12 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdCorridor {
    get: Get10
    post: Post6
  }
  
  export interface Get10 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter14[]
    responses: Responses15
  }
  
  export interface Parameter14 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema29
    example?: string
  }
  
  export interface Schema29 {
    type: string
  }
  
  export interface Responses15 {
    "200": N20015
    "202": N20211
    "308": N30811
    "400": N40011
    "404": N40411
    "413": N41311
    default: Default13
  }
  
  export interface N20015 {
    $ref: string
  }
  
  export interface N20211 {
    $ref: string
  }
  
  export interface N30811 {
    $ref: string
  }
  
  export interface N40011 {
    $ref: string
  }
  
  export interface N40411 {
    $ref: string
  }
  
  export interface N41311 {
    $ref: string
  }
  
  export interface Default13 {
    $ref: string
  }
  
  export interface Post6 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter15[]
    requestBody: RequestBody6
    responses: Responses16
  }
  
  export interface Parameter15 {
    $ref: string
  }
  
  export interface RequestBody6 {
    content: Content14
  }
  
  export interface Content14 {
    "application/json": ApplicationJson13
  }
  
  export interface ApplicationJson13 {
    schema: Schema30
  }
  
  export interface Schema30 {
    type: string
    required: string[]
    properties: Properties76
  }
  
  export interface Properties76 {
    coords: Coords4
    z: Z7
    datetime: Datetime6
    "parameter-name": ParameterName6
    "corridor-width": CorridorWidth
    "width-units": WidthUnits2
    "corridor-height": CorridorHeight
    "height-units": HeightUnits3
    "resolution-x": ResolutionX
    "resolution-y": ResolutionY
    crs: Crs8
    f: F5
  }
  
  export interface Coords4 {
    description: string
    type: string
  }
  
  export interface Z7 {
    type: string
  }
  
  export interface Datetime6 {
    type: string
  }
  
  export interface ParameterName6 {
    type: string
    items: Items73
  }
  
  export interface Items73 {
    type: string
  }
  
  export interface CorridorWidth {
    type: string
  }
  
  export interface WidthUnits2 {
    type: string
  }
  
  export interface CorridorHeight {
    type: string
  }
  
  export interface HeightUnits3 {
    type: string
  }
  
  export interface ResolutionX {
    type: string
  }
  
  export interface ResolutionY {
    type: string
  }
  
  export interface Crs8 {
    type: string
  }
  
  export interface F5 {
    type: string
  }
  
  export interface Responses16 {
    "200": N20016
    "202": N20212
    "308": N30812
    "400": N40012
    "404": N40412
    "413": N41312
    default: Default14
  }
  
  export interface N20016 {
    $ref: string
  }
  
  export interface N20212 {
    $ref: string
  }
  
  export interface N30812 {
    $ref: string
  }
  
  export interface N40012 {
    $ref: string
  }
  
  export interface N40412 {
    $ref: string
  }
  
  export interface N41312 {
    $ref: string
  }
  
  export interface Default14 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdItems {
    get: Get11
    post: Post7
  }
  
  export interface Get11 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter16[]
    responses: Responses17
  }
  
  export interface Parameter16 {
    $ref: string
  }
  
  export interface Responses17 {
    "200": N20017
    "202": N20213
    "308": N30813
    "400": N40013
    "404": N40413
    "413": N41313
    default: Default15
  }
  
  export interface N20017 {
    description: string
    content: Content15
  }
  
  export interface Content15 {
    "application/geo+json": ApplicationGeoJson2
    "application/json": ApplicationJson14
    "text/xml": TextXml5
  }
  
  export interface ApplicationGeoJson2 {
    schema: Schema31
  }
  
  export interface Schema31 {
    $ref: string
  }
  
  export interface ApplicationJson14 {
    schema: Schema32
  }
  
  export interface Schema32 {
    type: string
  }
  
  export interface TextXml5 {
    schema: Schema33
  }
  
  export interface Schema33 {
    type: string
  }
  
  export interface N20213 {
    $ref: string
  }
  
  export interface N30813 {
    $ref: string
  }
  
  export interface N40013 {
    $ref: string
  }
  
  export interface N40413 {
    $ref: string
  }
  
  export interface N41313 {
    $ref: string
  }
  
  export interface Default15 {
    $ref: string
  }
  
  export interface Post7 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter17[]
    requestBody: RequestBody7
    responses: Responses18
  }
  
  export interface Parameter17 {
    $ref: string
  }
  
  export interface RequestBody7 {
    content: Content16
  }
  
  export interface Content16 {
    "application/json": ApplicationJson15
  }
  
  export interface ApplicationJson15 {
    schema: Schema34
  }
  
  export interface Schema34 {
    type: string
    required: string[]
    properties: Properties77
  }
  
  export interface Properties77 {
    bbox: Bbox3
    datetime: Datetime7
  }
  
  export interface Bbox3 {
    type: string
  }
  
  export interface Datetime7 {
    type: string
  }
  
  export interface Responses18 {
    "200": N20018
    "202": N20214
    "308": N30814
    "400": N40014
    "404": N40414
    "413": N41314
    default: Default16
  }
  
  export interface N20018 {
    $ref: string
  }
  
  export interface N20214 {
    $ref: string
  }
  
  export interface N30814 {
    $ref: string
  }
  
  export interface N40014 {
    $ref: string
  }
  
  export interface N40414 {
    $ref: string
  }
  
  export interface N41314 {
    $ref: string
  }
  
  export interface Default16 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdItemsItemId {
    get: Get12
    post: Post8
  }
  
  export interface Get12 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter18[]
    responses: Responses19
  }
  
  export interface Parameter18 {
    $ref?: string
    name?: string
    in?: string
    required?: boolean
    description?: string
    schema?: Schema35
  }
  
  export interface Schema35 {
    type: string
  }
  
  export interface Responses19 {
    "200": N20019
    "202": N20215
    "308": N30815
    "400": N40015
    "404": N40415
    "413": N41315
    default: Default17
  }
  
  export interface N20019 {
    $ref: string
  }
  
  export interface N20215 {
    $ref: string
  }
  
  export interface N30815 {
    $ref: string
  }
  
  export interface N40015 {
    $ref: string
  }
  
  export interface N40415 {
    $ref: string
  }
  
  export interface N41315 {
    $ref: string
  }
  
  export interface Default17 {
    $ref: string
  }
  
  export interface Post8 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter19[]
    responses: Responses20
  }
  
  export interface Parameter19 {
    $ref: string
  }
  
  export interface Responses20 {
    "200": N20020
    "202": N20216
    "308": N30816
    "400": N40016
    "404": N40416
    "413": N41316
    default: Default18
  }
  
  export interface N20020 {
    $ref: string
  }
  
  export interface N20216 {
    $ref: string
  }
  
  export interface N30816 {
    $ref: string
  }
  
  export interface N40016 {
    $ref: string
  }
  
  export interface N40416 {
    $ref: string
  }
  
  export interface N41316 {
    $ref: string
  }
  
  export interface Default18 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstances {
    get: Get13
  }
  
  export interface Get13 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter20[]
    responses: Responses21
  }
  
  export interface Parameter20 {
    $ref: string
  }
  
  export interface Responses21 {
    "200": N20021
    default: Default19
  }
  
  export interface N20021 {
    description: string
    content: Content17
  }
  
  export interface Content17 {
    "application/json": ApplicationJson16
    "text/html": TextHtml6
  }
  
  export interface ApplicationJson16 {
    schema: Schema36
  }
  
  export interface Schema36 {
    type: string
    required: string[]
    properties: Properties78
  }
  
  export interface Properties78 {
    links: Links6
    instances: Instances
  }
  
  export interface Links6 {
    type: string
    items: Items74
    example: Example9[]
  }
  
  export interface Items74 {
    $ref: string
  }
  
  export interface Example9 {
    href: string
    hreflang: string
    rel: string
    type: string
  }
  
  export interface Instances {
    type: string
    items: Items75
  }
  
  export interface Items75 {
    $ref: string
  }
  
  export interface TextHtml6 {
    schema: Schema37
  }
  
  export interface Schema37 {
    type: string
  }
  
  export interface Default19 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdPosition {
    get: Get14
    post: Post9
  }
  
  export interface Get14 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter21[]
    responses: Responses22
  }
  
  export interface Parameter21 {
    $ref: string
  }
  
  export interface Responses22 {
    "200": N20022
    "202": N20217
    "308": N30817
    "400": N40017
    "404": N40417
    "413": N41317
    default: Default20
  }
  
  export interface N20022 {
    $ref: string
  }
  
  export interface N20217 {
    $ref: string
  }
  
  export interface N30817 {
    $ref: string
  }
  
  export interface N40017 {
    $ref: string
  }
  
  export interface N40417 {
    $ref: string
  }
  
  export interface N41317 {
    $ref: string
  }
  
  export interface Default20 {
    $ref: string
  }
  
  export interface Post9 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter22[]
    requestBody: RequestBody8
    responses: Responses23
  }
  
  export interface Parameter22 {
    $ref: string
  }
  
  export interface RequestBody8 {
    $ref: string
  }
  
  export interface Responses23 {
    "200": N20023
    "202": N20218
    "308": N30818
    "400": N40018
    "404": N40418
    "413": N41318
    default: Default21
  }
  
  export interface N20023 {
    $ref: string
  }
  
  export interface N20218 {
    $ref: string
  }
  
  export interface N30818 {
    $ref: string
  }
  
  export interface N40018 {
    $ref: string
  }
  
  export interface N40418 {
    $ref: string
  }
  
  export interface N41318 {
    $ref: string
  }
  
  export interface Default21 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdRadius {
    get: Get15
    post: Post10
  }
  
  export interface Get15 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter23[]
    responses: Responses24
  }
  
  export interface Parameter23 {
    $ref: string
  }
  
  export interface Responses24 {
    "200": N20024
    "202": N20219
    "308": N30819
    "400": N40019
    "404": N40419
    "413": N41319
    default: Default22
  }
  
  export interface N20024 {
    $ref: string
  }
  
  export interface N20219 {
    $ref: string
  }
  
  export interface N30819 {
    $ref: string
  }
  
  export interface N40019 {
    $ref: string
  }
  
  export interface N40419 {
    $ref: string
  }
  
  export interface N41319 {
    $ref: string
  }
  
  export interface Default22 {
    $ref: string
  }
  
  export interface Post10 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter24[]
    requestBody: RequestBody9
    responses: Responses25
  }
  
  export interface Parameter24 {
    $ref: string
  }
  
  export interface RequestBody9 {
    $ref: string
  }
  
  export interface Responses25 {
    "200": N20025
    "202": N20220
    "308": N30820
    "400": N40020
    "404": N40420
    "413": N41320
    default: Default23
  }
  
  export interface N20025 {
    $ref: string
  }
  
  export interface N20220 {
    $ref: string
  }
  
  export interface N30820 {
    $ref: string
  }
  
  export interface N40020 {
    $ref: string
  }
  
  export interface N40420 {
    $ref: string
  }
  
  export interface N41320 {
    $ref: string
  }
  
  export interface Default23 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdArea {
    get: Get16
    post: Post11
  }
  
  export interface Get16 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter25[]
    responses: Responses26
  }
  
  export interface Parameter25 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema38
  }
  
  export interface Schema38 {
    type: string
  }
  
  export interface Responses26 {
    "200": N20026
    "202": N20221
    "308": N30821
    "400": N40021
    "404": N40421
    "413": N41321
    default: Default24
  }
  
  export interface N20026 {
    $ref: string
  }
  
  export interface N20221 {
    $ref: string
  }
  
  export interface N30821 {
    $ref: string
  }
  
  export interface N40021 {
    $ref: string
  }
  
  export interface N40421 {
    $ref: string
  }
  
  export interface N41321 {
    $ref: string
  }
  
  export interface Default24 {
    $ref: string
  }
  
  export interface Post11 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter26[]
    requestBody: RequestBody10
    responses: Responses27
  }
  
  export interface Parameter26 {
    $ref: string
  }
  
  export interface RequestBody10 {
    content: Content18
  }
  
  export interface Content18 {
    "application/json": ApplicationJson17
  }
  
  export interface ApplicationJson17 {
    schema: Schema39
  }
  
  export interface Schema39 {
    type: string
    required: string[]
    properties: Properties79
  }
  
  export interface Properties79 {
    coords: Coords5
    z: Z8
    datetime: Datetime8
    "parameter-name": ParameterName7
    crs: Crs9
    "resolution-x": ResolutionX2
    "resolution-y": ResolutionY2
    f: F6
  }
  
  export interface Coords5 {
    description: string
    type: string
  }
  
  export interface Z8 {
    type: string
  }
  
  export interface Datetime8 {
    type: string
  }
  
  export interface ParameterName7 {
    type: string
    items: Items76
  }
  
  export interface Items76 {
    type: string
  }
  
  export interface Crs9 {
    type: string
  }
  
  export interface ResolutionX2 {
    type: string
  }
  
  export interface ResolutionY2 {
    type: string
  }
  
  export interface F6 {
    type: string
  }
  
  export interface Responses27 {
    "200": N20027
    "202": N20222
    "308": N30822
    "400": N40022
    "404": N40422
    "413": N41322
    default: Default25
  }
  
  export interface N20027 {
    $ref: string
  }
  
  export interface N20222 {
    $ref: string
  }
  
  export interface N30822 {
    $ref: string
  }
  
  export interface N40022 {
    $ref: string
  }
  
  export interface N40422 {
    $ref: string
  }
  
  export interface N41322 {
    $ref: string
  }
  
  export interface Default25 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdCube {
    get: Get17
    post: Post12
  }
  
  export interface Get17 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter27[]
    responses: Responses28
  }
  
  export interface Parameter27 {
    $ref: string
  }
  
  export interface Responses28 {
    "200": N20028
    "202": N20223
    "308": N30823
    "400": N40023
    "404": N40423
    "413": N41323
    default: Default26
  }
  
  export interface N20028 {
    $ref: string
  }
  
  export interface N20223 {
    $ref: string
  }
  
  export interface N30823 {
    $ref: string
  }
  
  export interface N40023 {
    $ref: string
  }
  
  export interface N40423 {
    $ref: string
  }
  
  export interface N41323 {
    $ref: string
  }
  
  export interface Default26 {
    $ref: string
  }
  
  export interface Post12 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter28[]
    requestBody: RequestBody11
    responses: Responses29
  }
  
  export interface Parameter28 {
    $ref: string
  }
  
  export interface RequestBody11 {
    $ref: string
  }
  
  export interface Responses29 {
    "200": N20029
    "202": N20224
    "308": N30824
    "400": N40024
    "404": N40424
    "413": N41324
    default: Default27
  }
  
  export interface N20029 {
    $ref: string
  }
  
  export interface N20224 {
    $ref: string
  }
  
  export interface N30824 {
    $ref: string
  }
  
  export interface N40024 {
    $ref: string
  }
  
  export interface N40424 {
    $ref: string
  }
  
  export interface N41324 {
    $ref: string
  }
  
  export interface Default27 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdTrajectory {
    get: Get18
    post: Post13
  }
  
  export interface Get18 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter29[]
    responses: Responses30
  }
  
  export interface Parameter29 {
    $ref: string
  }
  
  export interface Responses30 {
    "200": N20030
    "202": N20225
    "308": N30825
    "400": N40025
    "404": N40425
    "413": N41325
    default: Default28
  }
  
  export interface N20030 {
    $ref: string
  }
  
  export interface N20225 {
    $ref: string
  }
  
  export interface N30825 {
    $ref: string
  }
  
  export interface N40025 {
    $ref: string
  }
  
  export interface N40425 {
    $ref: string
  }
  
  export interface N41325 {
    $ref: string
  }
  
  export interface Default28 {
    $ref: string
  }
  
  export interface Post13 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter30[]
    requestBody: RequestBody12
    responses: Responses31
  }
  
  export interface Parameter30 {
    $ref: string
  }
  
  export interface RequestBody12 {
    $ref: string
  }
  
  export interface Responses31 {
    "200": N20031
    "202": N20226
    "308": N30826
    "400": N40026
    "404": N40426
    "413": N41326
    default: Default29
  }
  
  export interface N20031 {
    $ref: string
  }
  
  export interface N20226 {
    $ref: string
  }
  
  export interface N30826 {
    $ref: string
  }
  
  export interface N40026 {
    $ref: string
  }
  
  export interface N40426 {
    $ref: string
  }
  
  export interface N41326 {
    $ref: string
  }
  
  export interface Default29 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdCorridor {
    get: Get19
    post: Post14
  }
  
  export interface Get19 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter31[]
    responses: Responses32
  }
  
  export interface Parameter31 {
    $ref?: string
    name?: string
    in?: string
    description?: string
    required?: boolean
    schema?: Schema40
  }
  
  export interface Schema40 {
    items: Items77
  }
  
  export interface Items77 {
    type: string
  }
  
  export interface Responses32 {
    "200": N20032
    "202": N20227
    "308": N30827
    "400": N40027
    "404": N40427
    "413": N41327
    default: Default30
  }
  
  export interface N20032 {
    $ref: string
  }
  
  export interface N20227 {
    $ref: string
  }
  
  export interface N30827 {
    $ref: string
  }
  
  export interface N40027 {
    $ref: string
  }
  
  export interface N40427 {
    $ref: string
  }
  
  export interface N41327 {
    $ref: string
  }
  
  export interface Default30 {
    $ref: string
  }
  
  export interface Post14 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter32[]
    requestBody: RequestBody13
    responses: Responses33
  }
  
  export interface Parameter32 {
    $ref: string
  }
  
  export interface RequestBody13 {
    $ref: string
  }
  
  export interface Responses33 {
    "200": N20033
    "202": N20228
    "308": N30828
    "400": N40028
    "404": N40428
    "413": N41328
    default: Default31
  }
  
  export interface N20033 {
    $ref: string
  }
  
  export interface N20228 {
    $ref: string
  }
  
  export interface N30828 {
    $ref: string
  }
  
  export interface N40028 {
    $ref: string
  }
  
  export interface N40428 {
    $ref: string
  }
  
  export interface N41328 {
    $ref: string
  }
  
  export interface Default31 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdLocations {
    get: Get20
    post: Post15
  }
  
  export interface Get20 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter33[]
    responses: Responses34
  }
  
  export interface Parameter33 {
    $ref: string
  }
  
  export interface Responses34 {
    "200": N20034
    "202": N20229
    "308": N30829
    "400": N40029
    "404": N40429
    "413": N41329
    default: Default32
  }
  
  export interface N20034 {
    $ref: string
  }
  
  export interface N20229 {
    $ref: string
  }
  
  export interface N30829 {
    $ref: string
  }
  
  export interface N40029 {
    $ref: string
  }
  
  export interface N40429 {
    $ref: string
  }
  
  export interface N41329 {
    $ref: string
  }
  
  export interface Default32 {
    $ref: string
  }
  
  export interface Post15 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter34[]
    requestBody: RequestBody14
    responses: Responses35
  }
  
  export interface Parameter34 {
    $ref: string
  }
  
  export interface RequestBody14 {
    content: Content19
  }
  
  export interface Content19 {
    "application/json": ApplicationJson18
  }
  
  export interface ApplicationJson18 {
    schema: Schema41
  }
  
  export interface Schema41 {
    type: string
    properties: Properties80
  }
  
  export interface Properties80 {
    bbox: Bbox4
    datetime: Datetime9
  }
  
  export interface Bbox4 {
    type: string
  }
  
  export interface Datetime9 {
    type: string
  }
  
  export interface Responses35 {
    "200": N20035
    "202": N20230
    "308": N30830
    "400": N40030
    "404": N40430
    "413": N41330
    default: Default33
  }
  
  export interface N20035 {
    $ref: string
  }
  
  export interface N20230 {
    $ref: string
  }
  
  export interface N30830 {
    $ref: string
  }
  
  export interface N40030 {
    $ref: string
  }
  
  export interface N40430 {
    $ref: string
  }
  
  export interface N41330 {
    $ref: string
  }
  
  export interface Default33 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdLocationsLocId {
    get: Get21
    post: Post16
  }
  
  export interface Get21 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter35[]
    responses: Responses36
  }
  
  export interface Parameter35 {
    $ref?: string
    name?: string
    in?: string
    required?: boolean
    description?: string
    schema?: Schema42
  }
  
  export interface Schema42 {
    type: string
  }
  
  export interface Responses36 {
    "200": N20036
    "202": N20231
    "308": N30831
    "400": N40031
    "404": N40431
    "413": N41331
    default: Default34
  }
  
  export interface N20036 {
    $ref: string
  }
  
  export interface N20231 {
    $ref: string
  }
  
  export interface N30831 {
    $ref: string
  }
  
  export interface N40031 {
    $ref: string
  }
  
  export interface N40431 {
    $ref: string
  }
  
  export interface N41331 {
    $ref: string
  }
  
  export interface Default34 {
    $ref: string
  }
  
  export interface Post16 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter36[]
    requestBody: RequestBody15
    responses: Responses37
  }
  
  export interface Parameter36 {
    $ref: string
  }
  
  export interface RequestBody15 {
    content: Content20
  }
  
  export interface Content20 {
    "application/json": ApplicationJson19
  }
  
  export interface ApplicationJson19 {
    schema: Schema43
  }
  
  export interface Schema43 {
    type: string
    properties: Properties81
  }
  
  export interface Properties81 {
    datetime: Datetime10
    "parameter-name": ParameterName8
    crs: Crs10
    f: F7
  }
  
  export interface Datetime10 {
    type: string
  }
  
  export interface ParameterName8 {
    type: string
    items: Items78
  }
  
  export interface Items78 {
    type: string
  }
  
  export interface Crs10 {
    type: string
  }
  
  export interface F7 {
    type: string
  }
  
  export interface Responses37 {
    "200": N20037
    "202": N20232
    "308": N30832
    "400": N40032
    "404": N40432
    "413": N41332
    default: Default35
  }
  
  export interface N20037 {
    $ref: string
  }
  
  export interface N20232 {
    $ref: string
  }
  
  export interface N30832 {
    $ref: string
  }
  
  export interface N40032 {
    $ref: string
  }
  
  export interface N40432 {
    $ref: string
  }
  
  export interface N41332 {
    $ref: string
  }
  
  export interface Default35 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdLocations {
    get: Get22
    post: Post17
  }
  
  export interface Get22 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter37[]
    responses: Responses38
  }
  
  export interface Parameter37 {
    $ref: string
  }
  
  export interface Responses38 {
    "200": N20038
    "202": N20233
    "308": N30833
    "400": N40033
    "404": N40433
    "413": N41333
    default: Default36
  }
  
  export interface N20038 {
    $ref: string
  }
  
  export interface N20233 {
    $ref: string
  }
  
  export interface N30833 {
    $ref: string
  }
  
  export interface N40033 {
    $ref: string
  }
  
  export interface N40433 {
    $ref: string
  }
  
  export interface N41333 {
    $ref: string
  }
  
  export interface Default36 {
    $ref: string
  }
  
  export interface Post17 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter38[]
    requestBody: RequestBody16
    responses: Responses39
  }
  
  export interface Parameter38 {
    $ref: string
  }
  
  export interface RequestBody16 {
    $ref: string
  }
  
  export interface Responses39 {
    "200": N20039
    "202": N20234
    "308": N30834
    "400": N40034
    "404": N40434
    "413": N41334
    default: Default37
  }
  
  export interface N20039 {
    $ref: string
  }
  
  export interface N20234 {
    $ref: string
  }
  
  export interface N30834 {
    $ref: string
  }
  
  export interface N40034 {
    $ref: string
  }
  
  export interface N40434 {
    $ref: string
  }
  
  export interface N41334 {
    $ref: string
  }
  
  export interface Default37 {
    $ref: string
  }
  
  export interface CollectionsCollectionIdInstancesInstanceIdLocationsLocId {
    get: Get23
    post: Post18
  }
  
  export interface Get23 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter39[]
    responses: Responses40
  }
  
  export interface Parameter39 {
    $ref: string
  }
  
  export interface Responses40 {
    "200": N20040
    "202": N20235
    "308": N30835
    "400": N40035
    "404": N40435
    "413": N41335
    default: Default38
  }
  
  export interface N20040 {
    $ref: string
  }
  
  export interface N20235 {
    $ref: string
  }
  
  export interface N30835 {
    $ref: string
  }
  
  export interface N40035 {
    $ref: string
  }
  
  export interface N40435 {
    $ref: string
  }
  
  export interface N41335 {
    $ref: string
  }
  
  export interface Default38 {
    $ref: string
  }
  
  export interface Post18 {
    tags: string[]
    summary: string
    description: string
    operationId: string
    parameters: Parameter40[]
    requestBody: RequestBody17
    responses: Responses41
  }
  
  export interface Parameter40 {
    $ref: string
  }
  
  export interface RequestBody17 {
    $ref: string
  }
  
  export interface Responses41 {
    "200": N20041
    "202": N20236
    "308": N30836
    "400": N40036
    "404": N40436
    "413": N41336
    default: Default39
  }
  
  export interface N20041 {
    $ref: string
  }
  
  export interface N20236 {
    $ref: string
  }
  
  export interface N30836 {
    $ref: string
  }
  
  export interface N40036 {
    $ref: string
  }
  
  export interface N40436 {
    $ref: string
  }
  
  export interface N41336 {
    $ref: string
  }
  
  export interface Default39 {
    $ref: string
  }
  