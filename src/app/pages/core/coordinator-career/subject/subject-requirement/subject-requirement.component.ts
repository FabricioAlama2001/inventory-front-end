import {Component, OnInit} from '@angular/core';
import {PrimeIcons} from "primeng/api";
import {
  BreadcrumbService, CareersService,
  CataloguesHttpService,
  CoreService, CurriculumsHttpService, CurriculumsService,
  MessageService, RoutesService,
  SubjectsHttpService, SubjectsService
} from "@services/core";
import {CareerModel, SelectCareerDto, SelectSubjectDto, SubjectModel, SubjectRequirementModel} from "@models/core";
import {BreadcrumbEnum, CatalogueSubjectRequirementTypeEnum} from "@shared/enums";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-subject-requirement',
  templateUrl: './subject-requirement.component.html',
  styleUrls: ['./subject-requirement.component.scss']
})
export class SubjectRequirementComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;
  protected sourceDataPrequisites!: SubjectModel[];
  protected sourceDataCorequisites!: SubjectModel[];
  protected prerequisites: SubjectModel[] = [];
  protected corequisites: SubjectModel[] = [];
  protected subjects: SubjectModel[] = [];
  protected selectedSubject!: SubjectModel;

  constructor(private breadcrumbService: BreadcrumbService,
              protected coreService: CoreService,
              protected messageService: MessageService,
              protected curriculumsHttpService: CurriculumsHttpService,
              private routesService: RoutesService,
              protected subjectsService: SubjectsService,
              protected curriculumService: CurriculumsService,) {
    this.breadcrumbService.setItems([
      {label: BreadcrumbEnum.INSTITUTIONS, routerLink: [this.routesService.institutions]},
      {label: BreadcrumbEnum.CAREERS, routerLink: [this.routesService.careers]},
      {label: BreadcrumbEnum.CURRICULUMS, routerLink: [this.routesService.curriculums]},
      {label: BreadcrumbEnum.SUBJECTS, routerLink: [this.routesService.subjects]},
      {label: BreadcrumbEnum.SUBJECT_REQUIREMENTS},
    ]);

    this.selectedSubject = this.subjectsService.subject;
  }

  ngOnInit(): void {
    this.findSubjectsByCurriculum();
  }

  findSubjectsByCurriculum() {
    this.curriculumsHttpService.findSubjectsByCurriculum(this.curriculumService.curriculum.id!)
      .subscribe((subjects: any) => {
        this.sourceDataPrequisites = subjects;
        this.sourceDataCorequisites = subjects;
        const prerequisites = this.selectedSubject.subjectPrerequisites;
        const corequisites = this.selectedSubject.subjectCorequisites;

        const idsPrerequisitesAccepted = prerequisites.map(subjectRequirement => subjectRequirement.requirement.id);
        const idsCorequisitesAccepted = corequisites.map(subjectRequirement => subjectRequirement.requirement.id);

        this.prerequisites = subjects.filter((subject: { id: string; }) => idsPrerequisitesAccepted.includes(subject.id));
        this.corequisites = subjects.filter((subject: { id: string; }) => idsCorequisitesAccepted.includes(subject.id));

        const idssPrerequisitesForbidden = this.prerequisites.map(prerequisite => prerequisite.id);
        const idssCorequisitesForbidden = this.corequisites.map(corequisite => corequisite.id);

        this.sourceDataPrequisites = this.sourceDataPrequisites.filter(item => !idssPrerequisitesForbidden.includes(item.id));
        this.sourceDataCorequisites = this.sourceDataCorequisites.filter(item => !idssCorequisitesForbidden.includes(item.id));

        this.sourceDataPrequisites = this.sourceDataPrequisites.filter(item => item.id !== this.subjectsService.subject.id);
        this.sourceDataCorequisites = this.sourceDataCorequisites.filter(item => item.id !== this.subjectsService.subject.id);
      });
  }
}
