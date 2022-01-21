import {
  ElementRef,
  Injectable,
} from '@angular/core';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { DragMetaInput } from '@fullcalendar/common';
import { Drake } from 'dragula';
import { WorkPackageResource } from 'core-app/features/hal/resources/work-package-resource';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarDragService {
  drake:Drake;

  draggableWorkPackages$ = new BehaviorSubject<WorkPackageResource[]>([]);

  private workPackages:WorkPackageResource[];

  set draggableWorkPackages(wps:WorkPackageResource[]) {
    this.workPackages = wps;
  }

  get draggableWorkPackages():WorkPackageResource[] {
    return this.workPackages;
  }

  destroyDrake():void {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  registerDrag(container:ElementRef):void {
    this.drake = dragula({
      containers: [container.nativeElement],
      revertOnSpill: true,
    });

    this.drake.on('drag', (el:HTMLElement) => {
      el.classList.add('gu-transit');
    });

    // eslint-disable-next-line no-new
    new ThirdPartyDraggable(container.nativeElement, {
      itemSelector: '.op-add-existing-pane--wp',
      mirrorSelector: '.gu-mirror', // the dragging element that dragula renders
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      eventData: this.eventData.bind(this),
    });
  }

  handleDrop(workPackage:WorkPackageResource):void {
    this.draggableWorkPackages$
      .next(this
        .draggableWorkPackages$
        .value
        .filter((wp) => wp.id !== workPackage.id));
  }

  handleDropError(workPackage:WorkPackageResource):void {
    const oldDraggables = this.draggableWorkPackages$.value;
    const isElementStillVisible = oldDraggables.filter((wp) => wp.id === workPackage.id).length === 1;

    if (!isElementStillVisible) {
      this.draggableWorkPackages$
        .next(oldDraggables.concat(workPackage));
    }
  }

  private eventData(eventEl:HTMLElement):undefined|DragMetaInput {
    const wpID = eventEl.dataset.dragHelperId;
    if (wpID) {
      const workPackage = this.draggableWorkPackages$.value.find((wp) => wp.id === wpID);

      if (workPackage) {
        const startDate = moment(workPackage.startDate);
        const dueDate = moment(workPackage.dueDate);
        const diff = dueDate.diff(startDate, 'days') + 1;

        return {
          title: workPackage.subject,
          duration: {
            days: diff || 1,
          },
          className: `__hl_background_type_${workPackage.type.id as string}`,
          extendedProps: {
            workPackage,
          },
        };
      }

      return undefined;
    }

    return undefined;
  }
}
