export class Project {
  title: string = ''
  keywords: any[] = [{name: ""}]
  description: string = ''
  sampleProcessingProtocol: string = ''
  dataProcessingProtocol: string = ''
  experimentType: string = ''
  organisms: any[] = [{name: ""}]
  tissues: any[] = [{name: ""}]
  instruments: any[] = [{name: ""}]
  cellTypes: any[] = [{name: ""}]
  diseases: any[] = [{name: ""}]
  quantificationMethods: any[] = [{name: ""}]
  authors: any[] = [{name: "", contact: "", first: true}]
  collaborators: any[] = [{name: "", contact: ""}]
  pis: any[] = [{name: "", contact: ""}]
  date: any = {}
  sampleAnnotations: any[] = [{name: "", description: ""}]
  files: any[] = []
  databaseVersion: string = ""
  comparison: any[] = []
}
