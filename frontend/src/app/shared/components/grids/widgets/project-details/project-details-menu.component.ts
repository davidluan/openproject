// -- copyright
// OpenProject is an open source project management software.
// Copyright (C) 2012-2022 the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See COPYRIGHT and LICENSE files for more details.
//++

import { Injector } from '@angular/core';
import { Component } from '@angular/core';
import { WidgetAbstractMenuComponent } from 'core-app/shared/components/grids/widgets/menu/widget-abstract-menu.component';
import { OpContextMenuItem } from 'core-app/shared/components/op-context-menu/op-context-menu.types'
import { StateService } from '@uirouter/core';
import { InjectField } from 'core-app/shared/helpers/angular/inject-field.decorator';
import { OPContextMenuService } from 'core-app/shared/components/op-context-menu/op-context-menu.service'

@Component({
  selector: 'op-widget-project-details-menu',
  templateUrl: '../menu/widget-menu.component.html',
})
export class WidgetProjectDetailsMenuComponent extends WidgetAbstractMenuComponent {
  @InjectField() protected $state!:StateService;

  protected menuItemList = [
    this.removeItem,
    this.projectActivityLinkItem,
  ];

  constructor(public injector:Injector) {
    super();
  }

  protected get projectActivityLinkItem():OpContextMenuItem {
    // todo: make it work
    return {
      linkText: 'Project details activity',
      href: this.$state.href('https://www.google.fr'),
      // href: 'https://www.google.fr',
      onClick: (_event:JQuery.TriggeredEvent) => {
        void this.$state.go(
          'https://www.google.fr',
        );
        return true;
      },
      // onClick: () => {
      //     // this.router.navigate(['/detail']);
      //     console.log('clicked');
      //     return true;
      //   },
    };
  }
}
